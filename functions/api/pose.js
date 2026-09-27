const DEFAULT_JEV_MODEL = 'typesafe/jev';
// JSON Mode 対応モデル。旧 llama-3.1-8b-instruct は Cloudflare 側で廃止済み。
const DEFAULT_LLM_MODEL = '@cf/meta/llama-3.3-70b-instruct-fp8-fast';
const DEFAULT_CONFIDENCE_THRESHOLD = 0.72;

const POSE_SCHEMA = {
  type: 'object',
  properties: {
    gesture: { type: 'string', enum: ['neutral', 'peace', 'wave', 'thumbs_up', 'point', 'fist'] },
    hand: { type: 'string', enum: ['none', 'left', 'right', 'both'] },
    bodyLean: { type: 'string', enum: ['upright', 'slightly_forward', 'slightly_back', 'left', 'right'] },
    expression: { type: 'string', enum: ['neutral', 'smile', 'surprised', 'angry'] },
  },
  required: ['gesture', 'hand', 'bodyLean', 'expression'],
  additionalProperties: false,
};

const POSE_OPTIONS = {
  gesture: {
    neutral: 'No hand gesture is requested.',
    peace: 'A V sign / peace sign.',
    wave: 'Waving with an open hand.',
    thumbs_up: 'A thumbs-up gesture.',
    point: 'Pointing with one hand.',
    fist: 'Holding a fist.',
  },
  hand: {
    none: 'No specific hand, or no hand gesture.',
    left: 'The character\'s left hand.',
    right: 'The character\'s right hand.',
    both: 'Both hands.',
  },
  bodyLean: {
    upright: 'Standing upright.',
    slightly_forward: 'Leaning slightly forward.',
    slightly_back: 'Leaning slightly backward.',
    left: 'Leaning slightly to the character\'s left.',
    right: 'Leaning slightly to the character\'s right.',
  },
  expression: {
    neutral: 'A neutral expression.',
    smile: 'Smiling / happy.',
    surprised: 'A surprised expression.',
    angry: 'An angry expression.',
  },
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}

function getConfidenceThreshold(env) {
  const value = Number(env.POSE_CONFIDENCE_THRESHOLD);
  return Number.isFinite(value) && value >= 0 && value <= 1
    ? value
    : DEFAULT_CONFIDENCE_THRESHOLD;
}

function normalizePose(value = {}) {
  return {
    gesture: POSE_OPTIONS.gesture[value.gesture] ? value.gesture : 'neutral',
    hand: POSE_OPTIONS.hand[value.hand] ? value.hand : 'none',
    bodyLean: POSE_OPTIONS.bodyLean[value.bodyLean] ? value.bodyLean : 'upright',
    expression: POSE_OPTIONS.expression[value.expression] ? value.expression : 'neutral',
  };
}

function buildJevQuestions() {
  return Object.fromEntries(Object.entries(POSE_OPTIONS).map(([field, options]) => [field, {
    type: 'choice',
    instructions: `Classify the ${field} expressed by the user's pose request. Return only the best matching option.`,
    criteria: options,
  }]));
}

function readJevPose(result) {
  const answers = result?.answers || {};
  const pose = {};
  const confidence = {};

  for (const field of Object.keys(POSE_OPTIONS)) {
    const answer = answers[field];
    pose[field] = answer?.choice;
    confidence[field] = typeof answer?.confidence === 'number' ? answer.confidence : 0;
  }

  return { pose: normalizePose(pose), confidence };
}

function isConfident(confidence, threshold) {
  return Object.values(confidence).every((value) => value >= threshold);
}

function parseJsonText(value) {
  if (value && typeof value === 'object') return value;
  if (typeof value !== 'string') return null;

  const withoutFence = value.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  try {
    return JSON.parse(withoutFence);
  } catch {
    const start = withoutFence.indexOf('{');
    const end = withoutFence.lastIndexOf('}');
    if (start < 0 || end <= start) return null;
    try {
      return JSON.parse(withoutFence.slice(start, end + 1));
    } catch {
      return null;
    }
  }
}

function readLlmPose(result) {
  const response = result?.response ?? result?.result ?? result;
  const parsed = parseJsonText(response);
  return normalizePose(parsed?.pose || parsed || {});
}

async function runFallbackLlm(ai, model, prompt) {
  const result = await ai.run(model, {
    messages: [
      {
        role: 'system',
        content: [
          'You convert a natural-language character pose request into the supplied JSON schema.',
          'Do not explain. Return JSON only. Use the closest enum value; use neutral/upright when absent.',
        ].join(' '),
      },
      { role: 'user', content: prompt },
    ],
    response_format: {
      type: 'json_schema',
      json_schema: POSE_SCHEMA,
    },
  });
  return readLlmPose(result);
}

export async function onRequestPost(context) {
  const { request, env } = context;
  if (!env.AI || typeof env.AI.run !== 'function') {
    return json({ error: 'Workers AI binding (AI) is not configured.' }, 503);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Request body must be valid JSON.' }, 400);
  }

  const prompt = typeof body?.prompt === 'string' ? body.prompt.trim() : '';
  if (!prompt || prompt.length > 500) {
    return json({ error: 'prompt is required and must be 500 characters or fewer.' }, 400);
  }

  const jevModel = env.POSE_JEV_MODEL || DEFAULT_JEV_MODEL;
  const llmModel = env.POSE_LLM_MODEL || DEFAULT_LLM_MODEL;
  const threshold = getConfidenceThreshold(env);

  let stage = 'jev';
  try {
    if (env.POSE_JEV_ENABLED === 'false') {
      stage = 'llm-fallback';
      const fallbackPose = await runFallbackLlm(env.AI, llmModel, prompt);
      return json({
        pose: fallbackPose,
        source: 'llm',
        fallbackReason: 'jev_disabled',
      });
    }

    const jevResult = await env.AI.run(jevModel, {
      state: prompt,
      questions: buildJevQuestions(),
    });
    const jev = readJevPose(jevResult);

    if (isConfident(jev.confidence, threshold)) {
      return json({ pose: jev.pose, source: 'jev', confidence: jev.confidence });
    }

    stage = 'llm-fallback';
    const fallbackPose = await runFallbackLlm(env.AI, llmModel, prompt);
    return json({
      pose: fallbackPose,
      source: 'llm',
      confidence: jev.confidence,
      fallbackReason: 'jev_confidence_below_threshold',
    });
  } catch (error) {
    console.error('Pose interpretation failed', error);
    return json({
      error: 'Pose interpretation failed. Check the Workers AI binding and model settings.',
      stage,
      detail: error instanceof Error ? error.message : String(error),
    }, 502);
  }
}
