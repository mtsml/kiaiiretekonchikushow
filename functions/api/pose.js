const DEFAULT_JEV_MODEL = 'typesafe/jev';
// JSON Mode 対応モデル。旧 llama-3.1-8b-instruct は Cloudflare 側で廃止済み。
const DEFAULT_LLM_MODEL = '@cf/meta/llama-3.3-70b-instruct-fp8-fast';
const DEFAULT_CONFIDENCE_THRESHOLD = 0.72;
const EXPRESSION_NAMES = ['happy', 'angry', 'sad', 'relaxed', 'surprised', 'blink', 'blinkLeft', 'blinkRight', 'lookUp', 'lookDown', 'lookLeft', 'lookRight', 'aa', 'ih', 'ou', 'ee', 'oh'];
const FINGER_NAMES = ['Thumb', 'Index', 'Middle', 'Ring', 'Little'];
const RIG_BONE_NAMES = new Set(['hips', 'spine', 'chest', 'upperChest', 'neck', 'head', 'leftShoulder', 'leftUpperArm', 'leftLowerArm', 'leftHand', 'leftUpperLeg', 'leftLowerLeg', 'leftFoot', 'leftToes', 'rightShoulder', 'rightUpperArm', 'rightLowerArm', 'rightHand', 'rightUpperLeg', 'rightLowerLeg', 'rightFoot', 'rightToes', 'leftIndexProximal', 'leftIndexIntermediate', 'leftIndexDistal', 'leftMiddleProximal', 'leftMiddleIntermediate', 'leftMiddleDistal', 'leftRingProximal', 'leftRingIntermediate', 'leftRingDistal', 'leftLittleProximal', 'leftLittleIntermediate', 'leftLittleDistal', 'leftThumbMetacarpal', 'leftThumbProximal', 'leftThumbDistal', 'rightIndexProximal', 'rightIndexIntermediate', 'rightIndexDistal', 'rightMiddleProximal', 'rightMiddleIntermediate', 'rightMiddleDistal', 'rightRingProximal', 'rightRingIntermediate', 'rightRingDistal', 'rightLittleProximal', 'rightLittleIntermediate', 'rightLittleDistal', 'rightThumbMetacarpal', 'rightThumbProximal', 'rightThumbDistal', 'leftEye', 'rightEye', 'jaw']);
const RIG_BONE_LIST = [...RIG_BONE_NAMES];

// Astra の rig-manifest.json (v0.4.1) と同じ55ボーン・17表情を許可する。
// AIに未知のボーン名を生成させず、モデル差し替え時はこの定義を更新する。
const BONE_SCHEMA_PROPERTIES = Object.fromEntries(RIG_BONE_LIST.map((name) => [name, {
  type: 'array', minItems: 3, maxItems: 3,
  items: { type: 'number', minimum: -3.2, maximum: 3.2 },
}]));
const FINGER_SCHEMA_PROPERTIES = Object.fromEntries(FINGER_NAMES.map((name) => [name, {
  type: 'number', minimum: 0, maximum: 1,
}]));
const EXPRESSION_SCHEMA_PROPERTIES = Object.fromEntries(EXPRESSION_NAMES.map((name) => [name, {
  type: 'number', minimum: 0, maximum: 1,
}]));

const POSE_SCHEMA = {
  type: 'object',
  properties: {
    pose: {
      type: 'object',
      properties: {
        gesture: { type: 'string', enum: ['unspecified', 'neutral', 'peace', 'wave', 'thumbs_up', 'point', 'fist'] },
        hand: { type: 'string', enum: ['unspecified', 'none', 'left', 'right', 'both'] },
        bodyLean: { type: 'string', enum: ['unspecified', 'upright', 'slightly_forward', 'slightly_back', 'left', 'right'] },
        expression: { type: 'string', enum: ['unspecified', 'neutral', 'smile', 'surprised', 'angry'] },
        wink: { type: 'string', enum: ['unspecified', 'none', 'left', 'right'] },
        posture: { type: 'string', enum: ['unspecified', 'standing', 'sitting', 'crouching', 'kneeling', 'lying'] },
        gaze: { type: 'string', enum: ['unspecified', 'camera', 'left', 'right', 'up', 'down', 'away'] },
        action: { type: 'string', enum: ['unspecified', 'none', 'wave', 'bow', 'clap', 'point', 'dance'] },
        bones: {
          type: 'object',
          properties: BONE_SCHEMA_PROPERTIES,
          additionalProperties: false,
        },
        hands: {
          type: 'object',
          properties: {
            left: { type: 'string', enum: ['open', 'peace', 'point', 'thumbsUp', 'fist'] },
            right: { type: 'string', enum: ['open', 'peace', 'point', 'thumbsUp', 'fist'] },
          },
          additionalProperties: false,
        },
        fingers: {
          type: 'object',
          properties: {
            left: { type: 'object', properties: FINGER_SCHEMA_PROPERTIES, additionalProperties: false },
            right: { type: 'object', properties: FINGER_SCHEMA_PROPERTIES, additionalProperties: false },
          },
          additionalProperties: false,
        },
        expressions: {
          type: 'object',
          properties: EXPRESSION_SCHEMA_PROPERTIES,
          additionalProperties: false,
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
    unspecified: 'The user did not specify a hand gesture.',
    neutral: 'No hand gesture is requested.',
    peace: 'A V sign / peace sign.',
    wave: 'Waving with an open hand.',
    thumbs_up: 'A thumbs-up gesture.',
    point: 'Pointing with one hand.',
    fist: 'Holding a fist.',
  },
  hand: {
    unspecified: 'The user did not specify which hand is involved.',
    none: 'No specific hand, or no hand gesture.',
    left: 'The character\'s left hand.',
    right: 'The character\'s right hand.',
    both: 'Both hands.',
  },
  bodyLean: {
    unspecified: 'The user did not specify a body lean.',
    upright: 'Standing upright.',
    slightly_forward: 'Leaning slightly forward.',
    slightly_back: 'Leaning slightly backward.',
    left: 'Leaning slightly to the character\'s left.',
    right: 'Leaning slightly to the character\'s right.',
  },
  expression: {
    unspecified: 'The user did not specify a facial expression.',
    neutral: 'A neutral expression.',
    smile: 'Smiling / happy.',
    surprised: 'A surprised expression.',
    angry: 'An angry expression.',
  },
  wink: {
    unspecified: 'The user did not specify a wink.',
    none: 'No wink.',
    left: 'Wink with the character\'s left eye.',
    right: 'Wink with the character\'s right eye.',
  },
  posture: {
    unspecified: 'The user did not specify a posture.',
    standing: 'Standing upright.',
    sitting: 'Sitting on an unseen chair or floor.',
    crouching: 'Crouching with bent knees.',
    kneeling: 'Kneeling.',
    lying: 'Lying down.',
  },
  gaze: {
    unspecified: 'The user did not specify a gaze direction.',
    camera: 'Looking directly at the camera.',
    left: 'Looking to the character\'s left.',
    right: 'Looking to the character\'s right.',
    up: 'Looking upward.',
    down: 'Looking downward.',
    away: 'Looking away from the camera.',
  },
  action: {
    unspecified: 'The user did not specify a whole-body action.',
    none: 'No whole-body action.',
    wave: 'Waving.',
    bow: 'Bowing.',
    clap: 'Clapping hands.',
    point: 'Pointing.',
    dance: 'Dancing.',
  },
};

const DETAIL_OPTIONS = {
  simple: 'The request can be represented by the semantic pose fields above; no individual bone, finger, or facial parameter is needed.',
  detailed: 'The request needs individual bone rotations, finger curl values, detailed facial expressions, or precise gaze/body coordination.',
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
    posture: POSE_OPTIONS.posture[value.posture] ? value.posture : 'standing',
    gaze: POSE_OPTIONS.gaze[value.gaze] ? value.gaze : 'camera',
    action: POSE_OPTIONS.action[value.action] ? value.action : 'none',
  };
}

function sanitizePose(value = {}) {
  return readLlmPose({ response: { pose: value } });
}

function mergePose(base = {}, patch = {}) {
  const merged = { ...base };
  ['gesture', 'hand', 'bodyLean', 'expression', 'wink', 'posture', 'gaze', 'action'].forEach((field) => {
    if (patch[field] && patch[field] !== 'unspecified') merged[field] = patch[field];
  });
  ['bones', 'hands', 'fingers', 'expressions'].forEach((field) => {
    if (patch[field] && typeof patch[field] === 'object') {
      merged[field] = { ...(base[field] || {}), ...patch[field] };
    }
  });
  if (patch.lookAt) merged.lookAt = { ...(base.lookAt || {}), ...patch.lookAt };
  if (patch.motion) merged.motion = patch.motion;
  return sanitizePose(merged);
}

function buildJevQuestions() {
  const questions = Object.fromEntries(Object.entries(POSE_OPTIONS).map(([field, options]) => [field, {
    type: 'choice',
    instructions: `Classify the ${field} expressed by the user's pose request. Return only the best matching option.`,
    criteria: options,
  }]));
  questions.detailLevel = {
    type: 'choice',
    instructions: 'Decide whether this request needs individual bone, finger, detailed facial, or precise gaze parameters. Use detailed for fine-grained adjustments; otherwise use simple.',
    criteria: DETAIL_OPTIONS,
  };
  return questions;
}

function readJevPose(result) {
  const payload = parseJsonText(result?.response ?? result?.result ?? result) || {};
  const answers = payload.answers || payload.response?.answers || {};
  const pose = {};
  const confidence = {};

  for (const field of Object.keys(POSE_OPTIONS)) {
    const answer = answers[field];
    pose[field] = answer?.choice;
    confidence[field] = typeof answer?.confidence === 'number' ? answer.confidence : 0;
  }

  const detailAnswer = answers.detailLevel;
  const detailLevel = detailAnswer?.choice === 'detailed' ? 'detailed' : 'simple';
  const detailConfidence = typeof detailAnswer?.confidence === 'number' ? detailAnswer.confidence : 0;
  const valid = Object.values(answers).some((answer) => answer && (answer.choice !== undefined || answer.noul !== undefined || answer.score !== undefined));
  return { pose: normalizePose(pose), confidence, detailLevel, detailConfidence, valid };
}

function isConfident(confidence, pose, threshold) {
  return Object.entries(confidence).every(([field, value]) => {
    // 未指定項目は分類対象外。指定された項目だけを閾値判定する。
    if (pose[field] === 'unspecified') return true;
    return value >= threshold;
  });
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

async function runFallbackLlm(ai, model, prompt, currentPose) {
  const result = await ai.run(model, {
    messages: [
      {
        role: 'system',
        content: [
          'You convert a natural-language character pose request into a VRM pose command.',
          'Return JSON only with a pose object. Use semantic fields for known gestures and add bones, hands, fingers, expressions, or lookAt when the request needs detail.',
          'This is an incremental edit. Preserve the supplied current pose unless the user explicitly changes it. Use unspecified for semantic fields that should remain unchanged.',
          'Bone rotations are normalized VRM local Euler XYZ radians. Finger values are 0 (open) to 1 (curled). Expression values are 0 to 1.',
          'Use VRM humanoid names such as rightUpperArm, spine, neck, rightIndexProximal. Do not invent prose or unknown fields.',
        ].join(' '),
      },
      {
        role: 'user',
        content: JSON.stringify({ prompt, currentPose: currentPose || {} }),
      },
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

  const currentPose = body?.currentPose && typeof body.currentPose === 'object'
    ? sanitizePose(body.currentPose)
    : null;

  const jevModel = env.POSE_JEV_MODEL || DEFAULT_JEV_MODEL;
  const llmModel = env.POSE_LLM_MODEL || DEFAULT_LLM_MODEL;
  const threshold = getConfidenceThreshold(env);

  let stage = 'jev';
  try {
    if (env.POSE_JEV_ENABLED === 'false') {
      stage = 'llm-fallback';
      const fallbackPose = mergePose(currentPose || {}, await runFallbackLlm(env.AI, llmModel, prompt, currentPose));
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
    if (!jev.valid) throw new Error('Jev response did not contain typed answers.');

    if (jev.detailLevel === 'detailed') {
      stage = 'llm-fallback';
      const fallbackPose = mergePose(currentPose || {}, await runFallbackLlm(env.AI, llmModel, prompt, currentPose));
      return json({
        pose: fallbackPose,
        source: 'llm',
        confidence: { ...jev.confidence, detailLevel: jev.detailConfidence },
        fallbackReason: 'jev_detail_required',
      });
    }

    if (isConfident(jev.confidence, jev.pose, threshold) && jev.detailConfidence >= threshold) {
      return json({
        pose: mergePose(currentPose || {}, jev.pose),
        source: 'jev',
        confidence: { ...jev.confidence, detailLevel: jev.detailConfidence },
      });
    }

    stage = 'llm-fallback';
    const fallbackPose = mergePose(currentPose || {}, await runFallbackLlm(env.AI, llmModel, prompt, currentPose));
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
