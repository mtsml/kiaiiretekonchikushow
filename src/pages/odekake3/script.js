import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';
import { VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm';
import { createAvatarController } from './avatar-controls.js';

// プロジェクト直下に配置した Astra 出力モデルを読み込みます。
// パスを null にすると、ページ上の「モデルを選択」だけで検証できます。
const MODEL_URL = '/model.vrm';
const HUMANOID_BONES_URL = '/humanoid-bones.json';
const RIG_MANIFEST_URL = '/rig-manifest.json';

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
const loader = new GLTFLoader();
const clock = new THREE.Clock();

let currentModel = null;
let currentVrm = null;
let avatarController = null;
let currentPose = null;
const bones = new Map();
const restPose = new Map();
let humanoidBoneMap = {};
let rigManifest = null;
let posedGlbUrl = null;

loader.register((parser) => new VRMLoaderPlugin(parser));

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
  if (!status) return;
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
  // モデルの実寸を使う。高さを1以上に丸めると、小型モデルほど
  // カメラが遠くなり、ファーストビューで小さく見えてしまう。
  const height = Math.max(size.y, 0.01);
  const distance = Math.max(height * 1.2, 0.25);

  controls.target.set(center.x, center.y + height * 0.03, center.z);
  camera.position.set(center.x, center.y + height * 0.04, center.z + distance);
  controls.minDistance = Math.max(height * 0.35, 0.05);
  controls.maxDistance = Math.max(height * 8, 1);
  camera.near = Math.max(distance / 100, 0.001);
  camera.far = Math.max(distance * 100, 10);
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

function toAvatarCommand(pose = {}) {
  const command = { bones: {}, hands: {}, fingers: {}, expressions: {} };
  const directBones = pose.bones || (Object.values(pose).some((value) => value && Array.isArray(value.rotation)) ? pose : null);

  if (directBones) {
    Object.entries(directBones).forEach(([name, transform]) => {
      const allowed = !currentVrm || rigManifest?.bones?.[name];
      if (allowed && Array.isArray(transform)) command.bones[name] = transform;
      else if (allowed && Array.isArray(transform?.rotation)) command.bones[name] = transform.rotation;
    });
  }
  if (pose.hands && typeof pose.hands === 'object') command.hands = { ...pose.hands };
  if (pose.fingers && typeof pose.fingers === 'object') command.fingers = { ...pose.fingers };
  if (pose.expressions && typeof pose.expressions === 'object') command.expressions = { ...pose.expressions };
  if (pose.lookAt && typeof pose.lookAt === 'object') command.lookAt = { ...pose.lookAt };
  if (pose.motion === 'waveRight') command.motion = pose.motion;

  if (pose.gesture && pose.hand && pose.gesture !== 'neutral') {
    const sides = pose.hand === 'both' ? ['left', 'right'] : [pose.hand];
    const gesture = { wave: 'open', thumbs_up: 'thumbsUp' }[pose.gesture] || pose.gesture;
    sides.forEach((side) => {
      command.hands[side] = gesture;
      command.bones[`${side}UpperArm`] = side === 'left' ? [0, 0, 0.75] : [0, 0, -0.75];
      command.bones[`${side}LowerArm`] = side === 'left' ? [0, -0.45, 0] : [0, 0.45, 0];
    });
  }

  const lean = {
    slightly_forward: [0.23, 0, 0],
    slightly_back: [-0.18, 0, 0],
    left: [0, 0, 0.18],
    right: [0, 0, -0.18],
  }[pose.bodyLean];
  if (lean) {
    command.bones.spine = lean;
    command.bones.chest = lean.map((value) => value * 0.75);
  }

  const expression = { smile: 'happy', surprised: 'surprised', angry: 'angry' }[pose.expression];
  if (expression) command.expressions[expression] = 1;
  if (pose.wink === 'left') command.expressions.blinkLeft = 1;
  if (pose.wink === 'right') command.expressions.blinkRight = 1;

  const gaze = {
    camera: { yaw: 0, pitch: 0 },
    left: { yaw: -0.7, pitch: 0 },
    right: { yaw: 0.7, pitch: 0 },
    up: { yaw: 0, pitch: 0.7 },
    down: { yaw: 0, pitch: -0.7 },
    away: { yaw: 0.9, pitch: 0.2 },
  }[pose.gaze];
  if (gaze) command.lookAt = gaze;

  if (pose.posture === 'sitting') {
    command.bones.leftUpperLeg = [0.9, 0, 0];
    command.bones.rightUpperLeg = [0.9, 0, 0];
    command.bones.leftLowerLeg = [-1.4, 0, 0];
    command.bones.rightLowerLeg = [-1.4, 0, 0];
  } else if (pose.posture === 'crouching') {
    command.bones.leftUpperLeg = [0.55, 0, 0];
    command.bones.rightUpperLeg = [0.55, 0, 0];
    command.bones.leftLowerLeg = [-1.1, 0, 0];
    command.bones.rightLowerLeg = [-1.1, 0, 0];
    command.bones.spine = [0.15, 0, 0];
  } else if (pose.posture === 'kneeling') {
    command.bones.leftUpperLeg = [1.2, 0, 0];
    command.bones.rightUpperLeg = [1.2, 0, 0];
    command.bones.leftLowerLeg = [-1.5, 0, 0];
    command.bones.rightLowerLeg = [-1.5, 0, 0];
  }

  if (pose.action === 'bow') {
    command.bones.spine = [0.45, 0, 0];
    command.bones.chest = [0.3, 0, 0];
  } else if (pose.action === 'wave') {
    command.motion = 'waveRight';
  } else if (pose.action === 'clap') {
    command.bones.leftUpperArm = [0, 0, 0.65];
    command.bones.rightUpperArm = [0, 0, -0.65];
    command.bones.leftLowerArm = [0, -0.7, 0];
    command.bones.rightLowerArm = [0, 0.7, 0];
  }
  return command;
}

function clearModel() {
  if (currentModel) scene.remove(currentModel);
  currentModel = null;
  currentVrm = null;
  avatarController = null;
  currentPose = null;
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
      if (currentVrm && rigManifest) {
        avatarController = createAvatarController(currentVrm, rigManifest);
      }
      collectHumanoidBones(currentModel, currentVrm);
      fitCamera(currentModel);

      const kind = currentVrm ? 'VRM' : 'GLB/glTF';
      const found = [...bones.keys()].join(', ') || '対象ボーンなし';
      setStatus(`${kind} を読み込みました。検出したボーン: ${found}`);
      // 共有リンクがあればAPIを呼ばず、そのPoseを復元する。
      const sharedPose = readSharedPose();
      applyPoseResult({ pose: sharedPose || {} }, { showShare: Boolean(sharedPose) })
        .catch((error) => console.error('Default AR pose failed', error));
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

  if (avatarController) {
    avatarController.apply(toAvatarCommand(pose), { resetFirst: true });
    currentModel.updateMatrixWorld(true);
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

/**
 * AR変換（特にiOSのUSDZ変換）でスケルトン姿勢がリセットされる環境向けに、
 * 現在のボーン変形をメッシュ頂点へ焼き込んだ静的シーンを作ります。
 * Web表示用のVRM本体は変更しません。
 */
function createStaticPoseScene() {
  const root = SkeletonUtils.clone(currentModel);
  const position = new THREE.Vector3();
  const skinnedMeshes = [];
  root.traverse((node) => {
    if (node.isSkinnedMesh) skinnedMeshes.push(node);
  });

  skinnedMeshes.forEach((skinnedMesh) => {
    const geometry = skinnedMesh.geometry.clone();
    const positions = geometry.attributes.position;
    for (let index = 0; index < positions.count; index += 1) {
      skinnedMesh.getVertexPosition(index, position);
      positions.setXYZ(index, position.x, position.y, position.z);
    }
    positions.needsUpdate = true;
    geometry.deleteAttribute('skinIndex');
    geometry.deleteAttribute('skinWeight');
    // 表情の重みも現在値を頂点へ焼き込んだため、AR側で再計算させない。
    Object.keys(geometry.morphAttributes).forEach((name) => {
      delete geometry.morphAttributes[name];
    });
    const staticMesh = new THREE.Mesh(geometry, skinnedMesh.material);
    staticMesh.name = skinnedMesh.name;
    staticMesh.position.copy(skinnedMesh.position);
    staticMesh.quaternion.copy(skinnedMesh.quaternion);
    staticMesh.scale.copy(skinnedMesh.scale);
    staticMesh.matrix.copy(skinnedMesh.matrix);
    staticMesh.matrixAutoUpdate = skinnedMesh.matrixAutoUpdate;
    staticMesh.frustumCulled = false;
    skinnedMesh.parent.add(staticMesh);
    skinnedMesh.parent.remove(skinnedMesh);
  });
  root.updateMatrixWorld(true);
  return root;
}

/**
 * 現在のポーズを反映したシーンを、AR用のバイナリGLBへ変換します。
 * model-viewer / Scene Viewerへ渡す場合は、返されたBlob URLをsrcに設定します。
 */
export function exportCurrentPoseAsGlb() {
  if (!currentModel) return Promise.reject(new Error('モデルがまだ読み込まれていません。'));
  // normalized humanoid bone の変更を raw skeleton へ反映してから書き出す。
  currentVrm?.update(0);
  currentModel.updateMatrixWorld(true);
  const exportScene = createStaticPoseScene();
  return new Promise((resolve, reject) => {
    new GLTFExporter().parse(
      exportScene,
      (result) => {
        const blob = new Blob([result], { type: 'model/gltf-binary' });
        if (posedGlbUrl) URL.revokeObjectURL(posedGlbUrl);
        posedGlbUrl = URL.createObjectURL(blob);
        resolve(posedGlbUrl);
      },
      (error) => reject(error),
      { binary: true, onlyVisible: false, trs: false },
    );
  });
}

// AR用のmodel-viewer接続を追加するまで、開発者コンソールから確認できるようにします。
window.exportCurrentPoseAsGlb = exportCurrentPoseAsGlb;

const poseForm = document.getElementById('pose-form');
const posePrompt = document.getElementById('pose-prompt');
const poseSubmit = document.getElementById('pose-submit');
const poseShare = document.getElementById('pose-share');
const arLaunch = document.getElementById('ar-launch');
const arViewer = document.getElementById('ar-viewer');
const modelViewerReady = customElements.whenDefined('model-viewer');
arLaunch.disabled = true;
arLaunch.textContent = 'ARを準備中…';

async function fetchPose(prompt, signal) {
  const response = await fetch('/api/pose', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ prompt, ...(currentPose ? { currentPose } : {}) }),
    signal,
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'ポーズの解釈に失敗しました。');
  return data;
}

function encodeSharePayload(payload) {
  const bytes = new TextEncoder().encode(JSON.stringify(payload));
  let binary = '';
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function decodeSharePayload(value) {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (value.length % 4)) % 4);
  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
}

function readSharedPose() {
  const encoded = new URLSearchParams(window.location.hash.slice(1)).get('pose');
  if (!encoded) return null;
  try {
    const payload = decodeSharePayload(encoded);
    return payload?.version === 1 && payload.pose && typeof payload.pose === 'object'
      ? payload.pose
      : null;
  } catch (error) {
    console.warn('共有Poseを読み込めませんでした。', error);
    return null;
  }
}

function createShareUrl(pose) {
  const url = new URL(window.location.href);
  url.hash = `pose=${encodeSharePayload({ version: 1, model: MODEL_URL, pose })}`;
  return url.toString();
}

async function applyPoseResult(data, { showShare = true } = {}) {
  if (!currentModel) return;
  applyPose(data.pose);
  currentPose = data.pose;
  if (showShare) poseShare.hidden = false;
  const posedUrl = await exportCurrentPoseAsGlb();
  // model-viewerのカスタム要素が未定義の状態でsrcを設定すると、
  // 要素のupgrade時に値が失われることがある。
  await modelViewerReady;
  arLaunch.disabled = true;
  const enableArButton = () => {
    arLaunch.disabled = false;
    arLaunch.textContent = 'このポーズをARで見る';
  };
  arViewer.addEventListener('load', enableArButton, { once: true });
  arViewer.addEventListener('error', (event) => {
    console.error('AR用GLBの読み込みに失敗しました。', event?.detail || event);
    enableArButton();
  }, { once: true });
  // 一部ブラウザでは非表示のmodel-viewerがloadを発火しないため、
  // フォームや入力処理をブロックしないよう安全弁を置く。
  window.setTimeout(enableArButton, 3000);
  arViewer.src = posedUrl;
}

poseForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const prompt = posePrompt.value.trim();
  if (!prompt) return;

  poseSubmit.disabled = true;
  poseSubmit.textContent = '適用中…';
  try {
    const data = await fetchPose(prompt);
    await applyPoseResult(data);
  } catch (error) {
    console.error('Pose apply failed', error);
  } finally {
    poseSubmit.disabled = false;
    poseSubmit.textContent = 'ポーズを適用';
  }
});

poseShare.addEventListener('click', async () => {
  if (!currentPose) return;
  const shareUrl = createShareUrl(currentPose);
  try {
    if (navigator.share) {
      await navigator.share({ title: document.title, text: 'ポーズを共有', url: shareUrl });
    } else {
      await navigator.clipboard.writeText(shareUrl);
      poseShare.textContent = '共有リンクをコピーしました';
      window.setTimeout(() => { poseShare.textContent = 'このポーズを共有'; }, 2000);
    }
  } catch (error) {
    if (error.name !== 'AbortError') console.error('Pose share failed', error);
  }
});

arLaunch.addEventListener('click', () => {
  if (typeof arViewer.activateAR !== 'function' || arLaunch.disabled) return;
  arLaunch.disabled = true;
  arLaunch.textContent = 'ARを起動中…';
  const restoreArButton = () => {
    arLaunch.disabled = false;
    arLaunch.textContent = 'このポーズをARで見る';
  };
  const timeout = window.setTimeout(restoreArButton, 15000);
  const onStatus = (event) => {
    if (['session-started', 'object-placed', 'failed', 'not-presenting'].includes(event.detail?.status)) {
      window.clearTimeout(timeout);
      arViewer.removeEventListener('ar-status', onStatus);
      restoreArButton();
    }
  };
  arViewer.addEventListener('ar-status', onStatus);
  try {
    const result = arViewer.activateAR();
    if (result?.catch) result.catch(() => {
      window.clearTimeout(timeout);
      arViewer.removeEventListener('ar-status', onStatus);
      restoreArButton();
    });
  } catch (error) {
    window.clearTimeout(timeout);
    arViewer.removeEventListener('ar-status', onStatus);
    restoreArButton();
    console.error('AR launch failed', error);
  }
});

window.addEventListener('resize', resize);
resize();

function render() {
  requestAnimationFrame(render);
  const delta = clock.getDelta();
  if (avatarController) avatarController.update(delta);
  else currentVrm?.update(delta);
  controls.update();
  renderer.render(scene, camera);
}
render();

Promise.all([
  fetch(HUMANOID_BONES_URL).then((response) => (response.ok ? response.json() : {})),
  fetch(RIG_MANIFEST_URL).then((response) => (response.ok ? response.json() : null)),
])
  .then(([boneMap, manifest]) => {
    humanoidBoneMap = boneMap && typeof boneMap === 'object' ? boneMap : {};
    rigManifest = manifest;
    if (MODEL_URL) loadModel(MODEL_URL, '設定済みモデル');
    else setStatus('モデルを選択して検証を開始してください。');
  })
  .catch(() => {
    // 対応表がない場合も、一般的なボーン名の探索で読み込みを続けます。
    if (MODEL_URL) loadModel(MODEL_URL, '設定済みモデル');
    else setStatus('モデルを選択して検証を開始してください。');
  });
