import {Quaternion, Vector3} from 'three';

const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const fingers=['Thumb','Index','Middle','Ring','Little'];
export const poseNames=['armsUp','peaceRight','peaceLeft','fists','waveRight','leanForward',
  'winkLeft','winkRight','happy','surprised','peaceRightWinkLeft','point','thumbsUp'];

/** Normalized-bone controls. Never apply these Euler limits to raw Blender bones. */
export function createAvatarController(vrm,manifest){
  const h=vrm.humanoid,e=vrm.expressionManager;
  let waving=false,waveTime=0;
  h.autoUpdateHumanBones=true;
  // Static T-pose bounds otherwise cull hands incorrectly after large gestures.
  vrm.scene.traverse(o=>{if(o.isSkinnedMesh)o.frustumCulled=false;});
  if(vrm.lookAt)vrm.lookAt.autoUpdate=false;
  function setRotation(name,angles){
    const spec=manifest.bones[name],bone=h.getNormalizedBoneNode(name);
    if(!spec||!bone)throw Error('Unknown humanoid bone: '+name);
    if(!Array.isArray(angles)||angles.length!==3||!angles.every(Number.isFinite))throw Error('Rotation needs 3 finite radians');
    bone.rotation.set(...angles.map((v,i)=>clamp(v,...spec.rotationLimits['xyz'[i]])),'XYZ');
  }
  function expression(name,value){
    if(!manifest.expressions.includes(name)||!Number.isFinite(value))throw Error('Invalid expression: '+name);
    e.setValue(name,clamp(value,0,1));
  }
  function lookAt(values={}){
    const yaw=clamp(Number(values.yaw)||0,-1,1),pitch=clamp(Number(values.pitch)||0,-1,1);
    expression('lookLeft',yaw<0?-yaw:0);expression('lookRight',yaw>0?yaw:0);
    expression('lookDown',pitch<0?-pitch:0);expression('lookUp',pitch>0?pitch:0);
  }
  function curl(side,finger,value){
    if(!['left','right'].includes(side)||!fingers.includes(finger)||!Number.isFinite(value))throw Error('Invalid finger command');
    const parts=finger==='Thumb'?['Metacarpal','Proximal','Distal']:['Proximal','Intermediate','Distal'];
    for(const [i,part] of parts.entries()){
      const name=side+finger+part,spec=manifest.bones[name];
      const angle=clamp(value,0,1)*spec.curlRange[1]*(finger==='Thumb'?.65:1)*(i===0?.8:1);
      h.getNormalizedBoneNode(name).quaternion.setFromAxisAngle(new Vector3(...spec.curlAxis),angle);
    }
  }
  function hand(side,gesture){
    const open={open:fingers,peace:['Index','Middle'],point:['Index'],thumbsUp:['Thumb'],fist:[]}[gesture];
    if(!open)throw Error('Unknown hand gesture: '+gesture);
    for(const finger of fingers)curl(side,finger,open.includes(finger)?0:1);
    if(gesture==='peace'){
      for(const [finger,a] of [['Index',-.13],['Middle',.10]]){
        // Spread in the T-pose palm plane around normalized +Z.
        const b=h.getNormalizedBoneNode(side+finger+'Proximal');
        b.quaternion.multiply(new Quaternion().setFromAxisAngle(new Vector3(0,0,1),a*(side==='left'?1:-1)));
      }
    }
  }
  function reset(){
    waving=false;waveTime=0;
    h.resetNormalizedPose();e.resetValues();
    for(const [name,spec] of Object.entries(manifest.bones))setRotation(name,spec.initialNormalizedRotation);
    vrm.update(0);return api;
  }
  function apply(command,{resetFirst=false}={}){
    if(resetFirst)reset();
    for(const [name,value] of Object.entries(command.bones||{}))setRotation(name,value);
    for(const [name,value] of Object.entries(command.expressions||{}))expression(name,value);
    if(command.lookAt)lookAt(command.lookAt);
    for(const [side,gesture] of Object.entries(command.hands||{}))hand(side,gesture);
    for(const [side,values] of Object.entries(command.fingers||{}))for(const [finger,value] of Object.entries(values))curl(side,finger,value);
    if(command.motion!==undefined){if(command.motion!=='waveRight')throw Error('Unknown motion');waving=true;}
    // Prevent additive double closing or multiple vowel morphs from overdriving the face.
    const vowels=['aa','ih','ou','ee','oh'],sum=vowels.reduce((s,n)=>s+e.getValue(n),0);
    if(sum>1)for(const n of vowels)e.setValue(n,e.getValue(n)/sum);
    if(e.getValue('blink')>0){e.setValue('blinkLeft',0);e.setValue('blinkRight',0);}
    for(const pair of [['lookLeft','lookRight'],['lookUp','lookDown']]){
      const d=e.getValue(pair[0])-e.getValue(pair[1]);e.setValue(pair[0],Math.max(0,d));e.setValue(pair[1],Math.max(0,-d));
    }
    vrm.update(0);return api;
  }
  function gestureArm(side){const s=side==='left'?1:-1;setRotation(side+'UpperArm',[0,0,s*.75]);setRotation(side+'LowerArm',[0,-s*.45,0]);}
  function thumbUp(side){
    vrm.update(0);vrm.scene.updateMatrixWorld(true);
    const bone=h.getNormalizedBoneNode(side+'ThumbMetacarpal'),child=h.getNormalizedBoneNode(side+'ThumbProximal');
    const direction=child.getWorldPosition(new Vector3()).sub(bone.getWorldPosition(new Vector3())).normalize();
    // Slight outward spread keeps the short chibi thumb clear of the curled knuckles.
    const delta=new Quaternion().setFromUnitVectors(direction,new Vector3(side==='right'?-1:1,1.4,.5).normalize());
    const world=delta.multiply(bone.getWorldQuaternion(new Quaternion()));
    bone.quaternion.copy(bone.parent.getWorldQuaternion(new Quaternion()).invert().multiply(world));
  }
  function pose(name){
    reset();
    if(name==='armsUp'){setRotation('leftUpperArm',[0,0,1.35]);setRotation('rightUpperArm',[0,0,-1.35]);}
    else if(name==='peaceRight'||name==='peaceRightWinkLeft'){gestureArm('right');hand('right','peace');if(name==='peaceRightWinkLeft')expression('blinkLeft',1);}
    else if(name==='peaceLeft'){gestureArm('left');hand('left','peace');}
    else if(name==='fists'){hand('left','fist');hand('right','fist');}
    else if(name==='waveRight'){gestureArm('right');hand('right','open');setRotation('rightHand',[.25,0,.25]);waving=true;}
    else if(name==='leanForward'){setRotation('spine',[.23,0,0]);setRotation('chest',[.18,0,0]);}
    else if(name==='winkLeft')expression('blinkLeft',1);
    else if(name==='winkRight')expression('blinkRight',1);
    else if(name==='happy'||name==='surprised')expression(name,1);
    else if(name==='point'||name==='thumbsUp'){gestureArm('right');hand('right',name);if(name==='thumbsUp'){setRotation('rightHand',[0,0,-.7]);thumbUp('right');}}
    else if(name!=='rest')throw Error('Unknown pose: '+name);
    vrm.update(0);return api;
  }
  function update(delta){if(waving){waveTime+=delta;setRotation('rightHand',[.25,0,.25+.35*Math.sin(waveTime*5)]);}vrm.update(delta);}
  const api={reset,apply,setRotation,expression,lookAt,curl,hand,pose,update};
  return reset();
}

/** Offline phrase demonstration, not an AI language model. Reject unsupported requests. */
export function interpretPoseText(text){
  if(typeof text!=='string'||!text.trim())throw Error('指示を入力してください');
  const command={bones:{},hands:{},expressions:{}},recognized=[];
  function rule(pattern,fn){if(pattern.test(text)){fn();recognized.push(pattern.source);}}
  rule(/両腕.*(上げ|あげ)/,()=>Object.assign(command.bones,{leftUpperArm:[0,0,1.35],rightUpperArm:[0,0,-1.35]}));
  for(const [jp,side,s] of [['左','left',1],['右','right',-1]]){
    rule(new RegExp(jp+'手(?:で|を)?ピース'),()=>{command.hands[side]='peace';command.bones[side+'UpperArm']=[0,0,s*.75];command.bones[side+'LowerArm']=[0,-s*.45,0];});
    rule(new RegExp(jp+'目.*?(ウインク|ウィンク)'),()=>command.expressions['blink'+(side==='left'?'Left':'Right')]=1);
    rule(new RegExp(jp+'手(?:を)?振'),()=>{command.hands[side]='open';command.bones[side+'UpperArm']=[0,0,s*.75];command.bones[side+'Hand']=[.25,0,.25];if(side==='right')command.motion='waveRight';});
  }
  rule(/両手.*(握|にぎ)/,()=>Object.assign(command.hands,{left:'fist',right:'fist'}));
  rule(/前かがみ|前屈/,()=>Object.assign(command.bones,{spine:[.23,0,0],chest:[.18,0,0]}));
  rule(/笑顔|笑って/,()=>command.expressions.happy=1);
  rule(/驚|びっくり/,()=>command.expressions.surprised=1);
  rule(/瞬き|まばたき/,()=>command.expressions.blink=1);
  rule(/指差|指さ/,()=>command.hands.right='point');
  rule(/親指.*立/,()=>command.hands.right='thumbsUp');
  if(!recognized.length)throw Error('このデモの対応表現ではありません。詳細制御にはJSON命令を使用してください。');
  return {command,recognized,scope:'keyword-demo; unmatched wording is not interpreted'};
}
