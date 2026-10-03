const DEFAULT_JEV_MODEL = 'typesafe/jev';
// JSON Mode 対応モデル。旧 llama-3.1-8b-instruct は Cloudflare 側で廃止済み。
const DEFAULT_LLM_MODEL = '@cf/meta/llama-3.3-70b-instruct-fp8-fast';
const DEFAULT_CONFIDENCE_THRESHOLD = 0.72;
const EXPRESSION_NAMES = ['happy', 'angry', 'sad', 'relaxed', 'surprised', 'blink', 'blinkLeft', 'blinkRight', 'lookUp', 'lookDown', 'lookLeft', 'lookRight', 'aa', 'ih', 'ou', 'ee', 'oh'];
const FINGER_NAMES = ['Thumb', 'Index', 'Middle', 'Ring', 'Little'];
const RIG_BONE_NAMES = new Set(['hips', 'spine', 'chest', 'upperChest', 'neck', 'head', 'leftShoulder', 'leftUpperArm', 'leftLowerArm', 'leftHand', 'leftUpperLeg', 'leftLowerLeg', 'leftFoot', 'leftToes', 'rightShoulder', 'rightUpperArm', 'rightLowerArm', 'rightHand', 'rightUpperLeg', 'rightLowerLeg', 'rightFoot', 'rightToes', 'leftIndexProximal', 'leftIndexIntermediate', 'leftIndexDistal', 'leftMiddleProximal', 'leftMiddleIntermediate', 'leftMiddleDistal', 'leftRingProximal', 'leftRingIntermediate', 'leftRingDistal', 'leftLittleProximal', 'leftLittleIntermediate', 'leftLittleDistal', 'leftThumbMetacarpal', 'leftThumbProximal', 'leftThumbDistal', 'rightIndexProximal', 'rightIndexIntermediate', 'rightIndexDistal', 'rightMiddleProximal', 'rightMiddleIntermediate', 'rightMiddleDistal', 'rightRingProximal', 'rightRingIntermediate', 'rightRingDistal', 'rightLittleProximal', 'rightLittleIntermediate', 'rightLittleDistal', 'rightThumbMetacarpal', 'rightThumbProximal', 'rightThumbDistal', 'leftEye', 'rightEye', 'jaw']);

const POSE_SCHEMA = {
  type: 'object',
  properties: {
    pose: {
      type: 'object',
      properties: {
        gesture: { type: 'string', enum: ['neutral', 'peace', 'wave', 'thumbs_up', 'point', 'fist'] },
        hand: { type: 'string', enum: ['none', 'left', 'right', 'both'] },
        bodyLean: { type: 'string', enum: ['upright', 'slightly_forward', 'slightly_back', 'left', 'right'] },
        expression: { type: 'string', enum: ['neutral', 'smile', 'surprised', 'angry'] },
        wink: { type: 'string', enum: ['none', 'left', 'right'] },
        bones: {
          type: 'object',
          additionalProperties: {
            type: 'array', minItems: 3, maxItems: 3,
            items: { type: 'number', minimum: -3.2, maximum: 3.2 },
          },
        },
        hands: {
          type: 'object',
          additionalProperties: { type: 'string', enum: ['open', 'peace', 'point', 'thumbsUp', 'fist'] },
        },
        fingers: {
          type: 'object',
          additionalProperties: {
            type: 'object',
            additionalProperties: { type: 'number', minimum: 0, maximum: 1 },
          },
        },
        expressions: {
          type: 'object',
          additionalProperties: { type: 'number', minimum: 0, maximum: 1 },
        },
        lookAt: {
          type: 'object',
          properties: {
            yaw: { type: 'number', minimum: -1, maximum: 1 },
            pitch: { type: 'number', minimum: -1, maximum: 1 },
          },
          additionalProperties: false,
        },
        motion: { type: 'string', enum: ['waveRight'] },
      },
      additionalProperties: false,
    },
  },
  required: ['pose'],
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
  wink: {
    none: 'No wink.',
    left: 'Wink with the character\'s left eye.',
    right: 'Wink with the character\'s right eye.',
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
    wink: POSE_OPTIONS.wink[value.wink] ? value.wink : 'none',
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
  const value = parsed?.pose || parsed || {};
  const pose = normalizePose(value);
  const clamp = (number, min, max) => Math.max(min, Math.min(max, number));
  const bones = {};
  const expressions = {};
  const fingers = {};
  const hands = {};

  if (value.bones && typeof value.bones === 'object') {
    Object.entries(value.bones).slice(0, 55).forEach(([name, rawRotation]) => {
      const rotation = Array.isArray(rawRotation) ? rawRotation : rawRotation?.rotation;
      if (RIG_BONE_NAMES.has(name) && Array.isArray(rotation) && rotation.length === 3 && rotation.every(Number.isFinite)) {
        bones[name] = rotation.map((angle) => clamp(angle, -3.2, 3.2));
      }
    });
  }
  if (value.hands && typeof value.hands === 'object') {
    Object.entries(value.hands).forEach(([side, gesture]) => {
      if (['left', 'right'].includes(side) && ['open', 'peace', 'point', 'thumbsUp', 'fist'].includes(gesture)) hands[side] = gesture;
    });
  }
  if (value.fingers && typeof value.fingers === 'object') {
    Object.entries(value.fingers).forEach(([side, values]) => {
      if (!['left', 'right'].includes(side) || !values || typeof values !== 'object') return;
      const sideValues = {};
      FINGER_NAMES.forEach((finger) => {
        if (Number.isFinite(values[finger])) sideValues[finger] = clamp(values[finger], 0, 1);
      });
      if (Object.keys(sideValues).length) fingers[side] = sideValues;
    });
  }
  if (value.expressions && typeof value.expressions === 'object') {
    Object.entries(value.expressions).forEach(([name, amount]) => {
      if (EXPRESSION_NAMES.includes(name) && Number.isFinite(amount)) expressions[name] = clamp(amount, 0, 1);
    });
  }
  const lookAt = value.lookAt && typeof value.lookAt === 'object'
    ? { yaw: clamp(Number(value.lookAt.yaw) || 0, -1, 1), pitch: clamp(Number(value.lookAt.pitch) || 0, -1, 1) }
    : undefined;
  const motion = value.motion === 'waveRight' ? 'waveRight' : undefined;
  return { ...pose, bones, hands, fingers, expressions, ...(lookAt ? { lookAt } : {}), ...(motion ? { motion } : {}) };
}

async function runFallbackLlm(ai, model, prompt) {
  const result = await ai.run(model, {
    messages: [
      {
        role: 'system',
        content: [
          'You convert a natural-language character pose request into a VRM pose command.',
          'Return JSON only with a pose object. Use semantic fields for known gestures and add bones, hands, fingers, expressions, or lookAt when the request needs detail.',
          'Bone rotations are normalized VRM local Euler XYZ radians. Finger values are 0 (open) to 1 (curled). Expression values are 0 to 1.',
          'Use VRM humanoid names such as rightUpperArm, spine, neck, rightIndexProximal. Do not invent prose or unknown fields.',
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
