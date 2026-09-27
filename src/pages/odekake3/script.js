import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm';

// プロジェクト直下に配置した Astra 出力モデルを読み込みます。
// パスを null にすると、ページ上の「モデルを選択」だけで検証できます。
const MODEL_URL = '/model.vrm';
const HUMANOID_BONES_URL = '/humanoid-bones.json';

const POSES = {
  initial: {},
  'right-arm-up': {
    rightUpperArm: { rotation: [0, 0, -1.75] },
    rightLowerArm: { rotation: [0, 0, -0.2] },
  },
  'left-arm-up': {
    leftUpperArm: { rotation: [0, 0, 1.75] },
    leftLowerArm: { rotation: [0, 0, 0.2] },
  },
  'both-arms-up': {
    rightUpperArm: { rotation: [0, 0, -1.75] },
    rightLowerArm: { rotation: [0, 0, -0.2] },
    leftUpperArm: { rotation: [0, 0, 1.75] },
    leftLowerArm: { rotation: [0, 0, 0.2] },
  },
};
const POSE_BONE_NAMES = [
  'rightUpperArm', 'rightLowerArm', 'leftUpperArm', 'leftLowerArm',
  'spine', 'chest', 'upperChest',
];

const viewer = document.getElementById('viewer');
const status = document.getElementById('status');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(35, 1, 0.01, 100);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
const controls = new OrbitControls(camera, renderer.domElement);
const loadingManager = new THREE.LoadingManager();
const loader = new GLTFLoader(loadingManager);
const clock = new THREE.Clock();

let currentModel = null;
let currentVrm = null;
const localFileUrls = new Map();
const bones = new Map();
const restPose = new Map();
let humanoidBoneMap = {};

loader.register((parser) => new VRMLoaderPlugin(parser));
loadingManager.setURLModifier((url) => {
  const fileName = decodeURIComponent(url.split('/').pop().split('?')[0]);
  return localFileUrls.get(fileName) || url;
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
viewer.appendChild(renderer.domElement);

camera.position.set(0, 1.25, 3);
controls.target.set(0, 1.0, 0);
controls.enableDamping = true;
controls.minDistance = 0.6;
controls.maxDistance = 8;
scene.add(new THREE.HemisphereLight(0xffffff, 0x6f7890, 2));
const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
keyLight.position.set(2, 4, 3);
scene.add(keyLight);
scene.add(new THREE.GridHelper(10, 20, 0xaab5c5, 0xdce2ea));

function setStatus(message, isError = false) {
  status.textContent = message;
  status.classList.toggle('is-error', isError);
}

function resize() {
  const { width, height } = viewer.getBoundingClientRect();
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height, false);
}

function fitCamera(object) {
  const box = new THREE.Box3().setFromObject(object);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const height = Math.max(size.y, 1);
  const distance = Math.max(height * 1.7, 1.5);

  controls.target.set(center.x, center.y + height * 0.05, center.z);
  camera.position.set(center.x, center.y + height * 0.1, center.z + distance);
  camera.near = Math.max(distance / 100, 0.01);
  camera.far = distance * 100;
  camera.updateProjectionMatrix();
  controls.update();
}

function addBone(name, bone) {
  if (!bone || bones.has(name)) return;
  bones.set(name, bone);
  restPose.set(name, bone.quaternion.clone());
}

function getMappedBoneName(humanoidName) {
  const mapped = humanoidBoneMap.humanBones?.[humanoidName] || humanoidBoneMap[humanoidName];
  if (typeof mapped === 'string') return mapped;
  if (mapped && typeof mapped === 'object') return mapped.name || mapped.nodeName || mapped.bone;
  return null;
}

function findGlbBone(root, humanoidName) {
  const aliases = {
    rightUpperArm: ['rightupperarm', 'right_arm', 'rightarm', 'upperarm_r', 'r_upperarm', 'j_bip_r_upperarm'],
    rightLowerArm: ['rightlowerarm', 'right_forearm', 'rightforearm', 'lowerarm_r', 'r_lowerarm', 'j_bip_r_lowerarm'],
    leftUpperArm: ['leftupperarm', 'left_arm', 'leftarm', 'upperarm_l', 'l_upperarm', 'j_bip_l_upperarm'],
    leftLowerArm: ['leftlowerarm', 'left_forearm', 'leftforearm', 'lowerarm_l', 'l_lowerarm', 'j_bip_l_lowerarm'],
    spine: ['spine'],
    chest: ['chest'],
    upperChest: ['upperchest', 'upper_chest'],
  };
  const candidates = aliases[humanoidName] || [];
  const mappedName = getMappedBoneName(humanoidName);
  let found = null;
  root.traverse((node) => {
    const nodeName = node.name.toLowerCase().replace(/[ .-]/g, '_');
    const isMappedBone = mappedName && node.name === mappedName;
    const isAliasBone = candidates.some((candidate) => nodeName === candidate || nodeName.includes(candidate));
    if (node.isBone && !found && (isMappedBone || isAliasBone)) {
      found = node;
    }
  });
  return found;
}

function collectHumanoidBones(root, vrm) {
  bones.clear();
  restPose.clear();

  POSE_BONE_NAMES.forEach((name) => {
    const bone = vrm
      ? vrm.humanoid.getNormalizedBoneNode(name)
      : findGlbBone(root, name);
    addBone(name, bone);
  });
}

function semanticPoseToBonePose(pose = {}) {
  const bonePose = {};
  const gesture = pose.gesture || 'neutral';
  const hand = pose.hand || 'none';
  const raiseRight = hand === 'right' || hand === 'both';
  const raiseLeft = hand === 'left' || hand === 'both';
  const hasGesture = gesture !== 'neutral' && hand !== 'none';

  if (hasGesture && raiseRight) {
    bonePose.rightUpperArm = { rotation: [0, 0, -1.75] };
    bonePose.rightLowerArm = { rotation: [0, 0, -0.2] };
  }
  if (hasGesture && raiseLeft) {
    bonePose.leftUpperArm = { rotation: [0, 0, 1.75] };
    bonePose.leftLowerArm = { rotation: [0, 0, 0.2] };
  }

  const leanRotation = {
    slightly_forward: -0.18,
    slightly_back: 0.18,
    left: 0.18,
    right: -0.18,
  }[pose.bodyLean];
  if (typeof leanRotation === 'number') {
    const axis = pose.bodyLean === 'left' || pose.bodyLean === 'right' ? 'z' : 'x';
    const rotation = [0, 0, 0];
    rotation[axis === 'x' ? 0 : 2] = leanRotation;
    bonePose.spine = { rotation };
  }
  return bonePose;
}

function applyExpression(expression = 'neutral') {
  const manager = currentVrm?.expressionManager;
  if (!manager) return;
  ['happy', 'surprised', 'angry'].forEach((name) => manager.setValue(name, 0));
  const preset = { smile: 'happy', surprised: 'surprised', angry: 'angry' }[expression];
  if (preset) manager.setValue(preset, 1);
}

function clearModel() {
  if (currentModel) scene.remove(currentModel);
  currentModel = null;
  currentVrm = null;
  bones.clear();
  restPose.clear();
}

function loadModel(url, label) {
  setStatus(`${label} を読み込んでいます…`);
  loader.load(
    url,
    (gltf) => {
      clearModel();
      currentVrm = gltf.userData.vrm || null;
      currentModel = currentVrm ? currentVrm.scene : gltf.scene;

      if (currentVrm?.meta?.metaVersion === '0') VRMUtils.rotateVRM0(currentVrm);
      currentModel.traverse((node) => {
        if (node.isMesh) node.frustumCulled = false;
      });
      scene.add(currentModel);
      collectHumanoidBones(currentModel, currentVrm);
      fitCamera(currentModel);

      const kind = currentVrm ? 'VRM' : 'GLB/glTF';
      const found = [...bones.keys()].join(', ') || '対象ボーンなし';
      setStatus(`${kind} を読み込みました。検出したボーン: ${found}`);
    },
    undefined,
    (error) => {
      console.error(error);
      setStatus(`モデルを読み込めませんでした: ${error.message || 'ファイル形式またはパスを確認してください。'}`, true);
    },
  );
}

/**
 * 意味データ、または直接ボーン回転を含む Pose データを適用します。
 * 意味データはここで安全な固定マッピングに変換し、AI に自由な角度計算をさせません。
 * 直接回転を指定する場合は初期姿勢を基準にした [x, y, z]（ラジアン）です。
 */
export function applyPose(pose = {}) {
  if (!currentModel) {
    setStatus('先に VRM または GLB/glTF モデルを読み込んでください。', true);
    return;
  }

  const hasDirectBoneRotations = Object.values(pose).some((value) => value && Array.isArray(value.rotation));
  const bonePose = pose.bones || (hasDirectBoneRotations ? pose : semanticPoseToBonePose(pose));
  restPose.forEach((rotation, name) => bones.get(name).quaternion.copy(rotation));
  Object.entries(bonePose).forEach(([name, transform]) => {
    const bone = bones.get(name);
    if (!bone || !Array.isArray(transform.rotation)) return;
    const [x = 0, y = 0, z = 0] = transform.rotation;
    const offset = new THREE.Quaternion().setFromEuler(new THREE.Euler(x, y, z, 'XYZ'));
    bone.quaternion.copy(restPose.get(name)).multiply(offset);
  });
  applyExpression(pose.expression);
  currentModel.updateMatrixWorld(true);
}

document.querySelectorAll('[data-pose]').forEach((button) => {
  button.addEventListener('click', () => applyPose(POSES[button.dataset.pose]));
});

const poseForm = document.getElementById('pose-form');
const posePrompt = document.getElementById('pose-prompt');
const poseSubmit = document.getElementById('pose-submit');
const poseStatus = document.getElementById('pose-status');
const poseResult = document.getElementById('pose-result');

poseForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const prompt = posePrompt.value.trim();
  if (!prompt) {
    poseStatus.textContent = 'ポーズの指示を入力してください。';
    return;
  }

  poseSubmit.disabled = true;
  poseStatus.textContent = 'ポーズを解釈しています…';
  poseResult.hidden = true;
  try {
    const response = await fetch('/api/pose', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'ポーズの解釈に失敗しました。');
    applyPose(data.pose);
    poseStatus.textContent = `適用しました（${data.source === 'jev' ? 'Jev' : 'LLM'}）`;
    poseResult.textContent = JSON.stringify(data, null, 2);
    poseResult.hidden = false;
  } catch (error) {
    poseStatus.textContent = error.message;
  } finally {
    poseSubmit.disabled = false;
  }
});

document.getElementById('model-file').addEventListener('change', (event) => {
  const files = [...event.target.files];
  const modelFile = files.find((file) => /\.(vrm|glb|gltf)$/i.test(file.name));
  if (!modelFile) {
    setStatus('VRM、GLB、または glTF ファイルを選択してください。', true);
    return;
  }

  localFileUrls.forEach((url) => URL.revokeObjectURL(url));
  localFileUrls.clear();
  files.forEach((file) => localFileUrls.set(file.name, URL.createObjectURL(file)));
  loadModel(localFileUrls.get(modelFile.name), modelFile.name);
});

window.addEventListener('resize', resize);
resize();

function render() {
  requestAnimationFrame(render);
  const delta = clock.getDelta();
  currentVrm?.update(delta);
  controls.update();
  renderer.render(scene, camera);
}
render();

fetch(HUMANOID_BONES_URL)
  .then((response) => (response.ok ? response.json() : {}))
  .then((boneMap) => {
    humanoidBoneMap = boneMap && typeof boneMap === 'object' ? boneMap : {};
    if (MODEL_URL) loadModel(MODEL_URL, '設定済みモデル');
    else setStatus('モデルを選択して検証を開始してください。');
  })
  .catch(() => {
    // 対応表がない場合も、一般的なボーン名の探索で読み込みを続けます。
    if (MODEL_URL) loadModel(MODEL_URL, '設定済みモデル');
    else setStatus('モデルを選択して検証を開始してください。');
  });
