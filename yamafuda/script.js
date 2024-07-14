const SKILLS = [
  // kaho
  {
    id: "FM花帆",
    name: "FM花帆",
    src: "../assets/kaho_fm.jpg"
  },
  {
    id: "ST花帆",
    name: "ST花帆",
    src: "../assets/kaho_st.jpg"
  },
  {
    id: "ゆのくに花帆",
    name: "ゆのくに花帆",
    src: "../assets/kaho_yunokuni.jpg"
  },
  // saya
  {
    id: "ドルビさやか",
    name: "ドルビさやか",
    src: "../assets/saya_dorubi.jpg"
  },
  {
    id: "シャボンさやか",
    name: "シャボンさやか",
    src: "../assets/saya_syabon.jpg"
  },
  {
    id: "ゆのくにさやか",
    name: "ゆのくにさやか",
    src: "../assets/saya_yunokuni.jpg"
  },
  // ruri
  {
    id: "LttF瑠璃乃",
    name: "LttF瑠璃乃",
    src: "../assets/ruri_lttf.jpg"
  },
  {
    id: "夏めき瑠璃乃",
    name: "夏めき瑠璃乃",
    src: "../assets/ruri_natsu.jpg"
  },
  {
    id: "ツバサ瑠璃乃",
    name: "ツバサ瑠璃乃",
    src: "../assets/ruri_tsubasa.jpg"
  },
  // kozu
  {
    id: "ダイハツ梢",
    name: "ダイハツ梢",
    src: "../assets/kozu_daihatsu.jpg"
  },
  {
    id: "DN梢",
    name: "DN梢",
    src: "../assets/kozu_dn.jpg"
  },
  {
    id: "桃節銘記梢",
    name: "桃節銘記梢",
    src: "../assets/kozu_momo.jpg"
  },
  // tsuzu
  {
    id: "DB綴理",
    name: "DB綴理",
    src: "../assets/tsuzu_db.jpg"
  },
  {
    id: "DN綴理",
    name: "DN綴理",
    src: "../assets/tsuzu_dn.jpg"
  },
  {
    id: "ツバサ綴理",
    name: "ツバサ綴理",
    src: "../assets/tsuzu_tsubasa.jpg"
  },
  // megu
  {
    id: "冬めぐ",
    name: "冬めぐ",
    src: "../assets/megu_fuyu.jpg"
  },
  {
    id: "ハピめぐ",
    name: "ハピめぐ",
    src: "../assets/megu_happy.jpg"
  },
  {
    id: "ツバサめぐ",
    name: "ツバサめぐ",
    src: "../assets/megu_tsubasa.jpg"
  },
];
const SKILL_CONTAINER_ORIGINAL_WIDTH = 600;
const SKILL_ORIGINAL_SCALE = 0.7;
const SKILL_ORIGINAL_WIDTH = 100;

/**
 * skill からランダムに選んだ8つの画像を表示する
 */
const startGame = (hellomegImgElement) => {
  hellomegImgElement.onclick = null;

  // 手札を初期化
  const skills = new Skills(SKILLS);

  // 手札描画
  const container = document.getElementById("skill-container");
  appendSkillsToContainer(skills, container);

  // 山札ボタンを更新
  const yamafuda = document.getElementById("yamafuda-button");
  yamafuda.innerText = `山札：${skills.yamafudas.length}`;
  yamafuda.onclick = () => alert(skills.yamafudas.map(skill => skill.name).join("\n"));

  // 捨て札ボタンを更新
  const sutefuda = document.getElementById("sutefuda-button");
  sutefuda.innerText = `捨て札：${skills.sutefudas.length}`;
  sutefuda.onclick = () => alert(skills.sutefudas.map(skill => skill.name).join("\n"));

  document.getElementById("result").style.display = null;
}

/**
 * skills.tefuda を img 要素として描画して container に追加する
 * 
 * skills.tefuda は8つの前提で angle の初期値を設定している。
 * translateY は微調整した値なので計算式の意味を理解する必要はない。
 * 
 * @param {Skills} skills 
 * @param {HTMLDivElement} container 
 */
const appendSkillsToContainer = (skills, container) => {
  let angle = -10;

  const clientWidth = document.getElementsByClassName("container")[0].clientWidth;
  const scale = clientWidth / SKILL_CONTAINER_ORIGINAL_WIDTH;

  skills.tefudas.forEach((skill, index) => {
    const imgElement = document.createElement("img");
    imgElement.id = skill.id;
    imgElement.src = skill.src;
 
    // クリック時に山札からカードを引く
    imgElement.onclick = () => {
      const nextSkill = skills.drawSkill(imgElement.id);
      // 手札の表示情報を更新する
      imgElement.id = nextSkill.id;
      imgElement.src = nextSkill.src;
      // 山札と捨て札の表示情報を更新する
      document.getElementById("yamafuda-button").innerText = `山札：${skills.yamafudas.length}`;
      document.getElementById("sutefuda-button").innerText = `捨て札：${skills.sutefudas.length}`;
    }

    // 8つの img が扇形に並ぶように各 skill の位置を調整する
    const translateY = (Math.abs(index - 3.5) * 2) ** 1.13 * 2;
    imgElement.style.width = `${SKILL_ORIGINAL_WIDTH * SKILL_ORIGINAL_SCALE * scale}px`;
    imgElement.style.height = "auto";
    imgElement.style.transform = `rotate(${angle}deg) translateY(${translateY}px)`;
    imgElement.classList.add("skill");

    container.appendChild(imgElement);

    angle += 2.5;
  });
}

class Skills {
  constructor(originalSkills) {
    // ランダムに8つの要素を抽出する
    const skills = shuffleArray(originalSkills)
                   .map((skill, index) => ({
                     ...skill,
                     state: index < 8 ? Skills.STATES.TEFUDA : Skills.STATES.YAMAFUDA
                   }));
    this.skills = skills;
  }

  /**
   * skill の状態管理
   */
  static STATES = {
    YAMAFUDA: "yamafuda",
    TEFUDA: "tefuda",
    SUTEFUDA: "sutefuda",
  }

  /**
   * 手札
   */
  get tefudas() {
    return this.skills.filter(skill => skill.state === Skills.STATES.TEFUDA);
  }

  /**
   * 山札
   */
  get yamafudas() {
    return this.skills.filter(skill => skill.state === Skills.STATES.YAMAFUDA);
  }

  /**
   * 捨て札
   */
  get sutefudas() {
    return this.skills.filter(skill => skill.state === Skills.STATES.SUTEFUDA);
  }

  /**
   * 山札から新しい skill を一枚引いてその値を返却する
   */
  drawSkill(usedSkillId) {
    // 山札が0枚の場合は捨て札を山札に戻す
    if (this.yamafudas.length === 0) {
      this.sutefudas.forEach(skill => {
        skill.state = Skills.STATES.YAMAFUDA;
      });
    }

    // 山札から skill を一枚ランダムに引く
    const nextSkill = shuffleArray(this.yamafudas)[0];
    nextSkill.state = Skills.STATES.TEFUDA;

    // 使用した skill を捨て札に置く
    this.skills.find(skill => skill.id === usedSkillId).state = Skills.STATES.SUTEFUDA;

    return nextSkill;
  }
}

/**
 * 配列をランダムに並び替える
 */
const shuffleArray = (array) => {
  // Fisher-Yates シャッフル
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
