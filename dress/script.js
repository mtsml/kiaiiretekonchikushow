const TWEET_INTENT_URL = "https://twitter.com/intent/tweet";
const HELLOMEG_DRESS_HASHTAG = "#ハロめぐドレス";
const HELLOMEG_DRESS_TWEET = "ドレスをつくってオシャレに山札管理を覚えよう。私がつくったドレスは…";
const HELLOMEG_DRESS_URL = "https://kiaiiretekonchiku.show/dress/index.html";

const SKILLS = [
  // gin
  {
    id: "gin_bsbd",
    src: "../assets/gin_bsbd.jpg",
    dress: true,
    dressSrcs: [
      "../assets/gin_bsbd-dress01.jpg",
      "../assets/gin_bsbd-dress02.jpg",
      "../assets/gin_bsbd-dress02.jpg",
    ],
    dressOnlySrc: "../assets/gin_bsbd-dress.png",
    usedCnt: 0,
  },
  {
    id: "gin_seiran",
    src: "../assets/gin_seiran.jpg",
    dress: true,
    dressSrcs: [
      "../assets/gin_seiran-dress01.jpg",
      "../assets/gin_seiran-dress02.jpg",
      "../assets/gin_seiran-dress03.jpg",
    ],
    dressOnlySrc: "../assets/gin_seiran-dress.png",
    usedCnt: 0,
  },
  // suzu
  {
    id: "suzu_bsbd",
    src: "../assets/suzu_bsbd.jpg",
  },
  {
    id: "suzu_ladybug",
    src: "../assets/suzu_ladybug.jpg",
  },
  // hime
  {
    id: "hime_mirakuri",
    src: "../assets/hime_mirakuri.jpg",
  },
  {
    id: "hime_seiran",
    src: "../assets/hime_seiran.jpg",
  },
  // kaho
  {
    id: "kaho_hsct",
    src: "../assets/kaho_hsct.jpg",
  },
  {
    id: "kaho_utage",
    src: "../assets/kaho_utage.jpg",
  },
  // saya
  {
    id: "saya_lttf",
    src: "../assets/saya_lttf.jpg",
  },
  // ruri
  {
    id: "ruri_db",
    src: "../assets/ruri_db.jpg",
    reshuffle: true,
  },
  {
    id: "ruri_mirakuri",
    src: "../assets/ruri_mirakuri.jpg",
    reshuffle: true,
  },
  // kozu
  {
    id: "kozu_dn",
    src: "../assets/kozu_dn.jpg",
  },
  {
    id: "kozu_hsct",
    src: "../assets/kozu_hsct.jpg",
  },
  // tsuzu
  {
    id: "tsuzu_cn",
    src: "../assets/tsuzu_cn.jpg",
  },
  {
    id: "tsuzu_tousetsu",
    src: "../assets/tsuzu_tousetsu.jpg",
  },
  // megu
  {
    id: "megu_hsct",
    src: "../assets/megu_hsct.jpg",
    reshuffle: true,
  },
  {
    id: "megu_mirakuri",
    src: "../assets/megu_mirakuri.jpg",
  },
];
const SKILL_CONTAINER_ORIGINAL_WIDTH = 600;
const SKILL_ORIGINAL_WIDTH = 100;
const SKILL_DEFAULT_SCALE = 0.7;
const SKILL_TRANSFORMS = [
  {
    angle: -9.1,
    translateY: 23,
  },
  {
    angle: -6.5,
    translateY: 13,
  },
  {
    angle: -3.9,
    translateY: 7,
  },
  {
    angle: -1.3,
    translateY: 2,
  },
  {
    angle: 1.3,
    translateY: 2,
  },
  {
    angle: 3.9,
    translateY: 7,
  },
  {
    angle: 6.5,
    translateY: 13,
  },
  {
    angle: 9.1,
    translateY: 23,
  },
];

/**
 * skill からランダムに選んだ8つの画像を表示する
 */
const startGame = (hellomegImgElement) => {
  hellomegImgElement.onclick = null;

  // 手札を初期化
  const container = document.getElementById("skill-container");
  const skills = new Skills(SKILLS, container);
  skills.appendTefudasToContainer();

  // モーダル表示ボタンを更新
  updateModalOpenButton(skills);

  document.getElementById("description").style.display = "none";
  document.getElementById("result").style.display = null;
}

/**
 * モーダル表示ボタンのテキストをクリック時の処理を更新する
 * 
 * @param {Skills} skills
 */
const updateModalOpenButton = (skills) => {
  const text = `捨て札：${String(skills.sutefudas.length).padStart(2, "0")} 山札：${String(skills.yamafudas.length).padStart(2, "0")}`;
  const modalOpenButton = document.getElementById("confirm-skill-modal-open-button");
  modalOpenButton.innerText = text;
  modalOpenButton.onclick = () => showConfirmSkillModal(skills);
}

/**
 * カード確認モーダルを開く
 * 
 * @param {Skills} skills
 */
const showConfirmSkillModal = (skills) => {
  // 各要素を初期化する
  const tefudaList = document.getElementById("confirm-skill-modal-tefuda-list");
  while (tefudaList.firstChild) tefudaList.removeChild(tefudaList.firstChild);
  const yamafudaList = document.getElementById("confirm-skill-modal-yamafuda-list");
  while (yamafudaList.firstChild) yamafudaList.removeChild(yamafudaList.firstChild);
  const sutefudaList = document.getElementById("confirm-skill-modal-sutefuda-list");
  while (sutefudaList.firstChild) sutefudaList.removeChild(sutefudaList.firstChild);

  // 手札・山札・捨札の sction に skill を振り分け
  skills.tefudas.forEach(skill => tefudaList.appendChild(skill.confirmSkillModalElement));
  skills.yamafudas.forEach(skill => yamafudaList.appendChild(skill.confirmSkillModalElement));
  skills.sutefudas.forEach(skill => sutefudaList.appendChild(skill.confirmSkillModalElement));

  const modal = document.getElementById("confirm-skill-modal"); 
  modal.showModal();
}

/**
 * カード確認モーダルを閉じる
 */
const closeConfirmSkillModal = () => {  
  const modal = document.getElementById("confirm-skill-modal");
  modal.close();
}

/**
 * カード入替モーダルを開く
 * 
 * @param {Skills} skills
 */
const openReplaceSkillModal = (skills, replaceFromSkillId) => {
  // 各要素を初期化する
  const replaceFromSection = document.getElementById("replace-skill-modal-replace-from");
  while (replaceFromSection.firstChild) replaceFromSection.removeChild(replaceFromSection.firstChild);
  const tefudaList = document.getElementById("replace-skill-modal-tefuda-list");
  while (tefudaList.firstChild) tefudaList.removeChild(tefudaList.firstChild);
  const yamafudaList = document.getElementById("replace-skill-modal-yamafuda-list");
  while (yamafudaList.firstChild) yamafudaList.removeChild(yamafudaList.firstChild);
  const sutefudaList = document.getElementById("replace-skill-modal-sutefuda-list");
  while (sutefudaList.firstChild) sutefudaList.removeChild(sutefudaList.firstChild);

  // 表示要素の出し分け
  const replaceFromSkill = skills.findById(replaceFromSkillId);
  document.getElementById(`replace-skill-modal-tefuda`).style.display = replaceFromSkill.state === Skills.STATES.TEFUDA ? 'none' : null;
  document.getElementById(`replace-skill-modal-yamafuda`).style.display = replaceFromSkill.state === Skills.STATES.YAMAFUDA ? 'none' : null;
  document.getElementById(`replace-skill-modal-sutefuda`).style.display = replaceFromSkill.state === Skills.STATES.SUTEFUDA ? 'none' : null;
  replaceFromSection.appendChild(replaceFromSkill.replaceFromElement);
  const description = document.createElement("p");
  description.innerText = "タップしたカードと入れ替え"
  replaceFromSection.appendChild(description);
  
  // 手札・山札・捨札の sction に skill を振り分け
  skills.tefudas.forEach(skill => tefudaList.appendChild(skill.replaceSkillModalElement));
  skills.yamafudas.forEach(skill => yamafudaList.appendChild(skill.replaceSkillModalElement));
  skills.sutefudas.forEach(skill => sutefudaList.appendChild(skill.replaceSkillModalElement));

  const modal = document.getElementById("replace-skill-modal");
  modal.showModal(); 
}

/**
 * カード入替モーダルを閉じる
 */
const closeReplaceSkillModal = () => {
  const modal = document.getElementById("replace-skill-modal");
  modal.close(); 
}

class Skills {
  /**
   * constructor
   * 
   * @param {*} originalSkills 
   * @param {HTMLDivElement} container 
   */
  constructor(originalSkills, container) {
    // 8つの img が扇形に並ぶような手札の style を定義する
    const scale = getScale();
    this.tefudaStyles = SKILL_TRANSFORMS.map(({ angle, translateY }) => ({
      width: `${SKILL_ORIGINAL_WIDTH * SKILL_DEFAULT_SCALE * scale}px`,
      height: "auto",
      transform: `rotate(${angle}deg) translateY(${translateY * scale}px)`,
    }));
    
    // NOTE: パフォーマンス改善のため各画面で利用する img 要素を作成して格納しておく
    const skills = shuffleArray(originalSkills).map((skill, index) => {
      // メイン画面用
      const mainElement = createSkillElement(skill.id, skill.src);
      mainElement.onclick = () => {
        if (skill.reshuffle) {
          this.reshuffle(mainElement.id);
        } else if (skill.dress) {
          this.dress(mainElement.id);
        } else {
          this.drawSkill(mainElement.id);
        }
        updateModalOpenButton(this);
      }

      // カード確認画面用
      const confirmSkillModalElementImg = createSkillElement(`confirm-skill-modal-skill-${skill.id}`, skill.src);
      confirmSkillModalElementImg.style.width = `${SKILL_ORIGINAL_WIDTH * SKILL_DEFAULT_SCALE * scale}px`;
      confirmSkillModalElementImg.style.height = "auto";
      confirmSkillModalElementImg.onclick = () => openReplaceSkillModal(this, skill.id);
      const confirmSkillModalElement = document.createElement("li");
      confirmSkillModalElement.appendChild(confirmSkillModalElementImg);

      // カード入替画面用
      const replaceSkillModalElementImg = createSkillElement(`replace-skill-modal-skill-${skill.id}`, skill.src);
      replaceSkillModalElementImg.style.width = `${SKILL_ORIGINAL_WIDTH * SKILL_DEFAULT_SCALE * scale}px`;
      replaceSkillModalElementImg.style.height = "auto";
      replaceSkillModalElementImg.onclick = () => {
        const replaceFromSkillId = document.getElementById("replace-skill-modal-replace-from").querySelector("img").id;
        this.replace(replaceFromSkillId, skill.id);
        closeReplaceSkillModal();
      };  
      const replaceSkillModalElement = document.createElement("li");
      replaceSkillModalElement.appendChild(replaceSkillModalElementImg);

      const replaceFromElement = document.createElement("img");
      replaceFromElement.id = skill.id;
      replaceFromElement.src = skill.src;
      replaceFromElement.style.width = `${SKILL_ORIGINAL_WIDTH * scale}px`;
      replaceFromElement.style.height = "auto";

      return {
        ...skill,
        // ランダムに8つの要素を手札とする
        state: index < 8 ? Skills.STATES.TEFUDA : Skills.STATES.YAMAFUDA,
        mainElement,
        confirmSkillModalElement,
        replaceSkillModalElement,
        replaceFromElement,
      }
    });

    this.skills = skills;
    this.container = container;
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
   * 指定の skillId の skill を返却する
   */
  findById(skillId) {
    return this.skills.find(skill => skill.id === skillId);
  }

  /**
   * 手札を描画する
   */
  appendTefudasToContainer() {
    // 初期化
    while (this.container.firstChild) this.container.removeChild(this.container.firstChild);

    this.tefudas.forEach((skill, index) => {
      skill.tefudaStylesIndex = index;
      skill.mainElement.style.width = this.tefudaStyles[index].width;
      skill.mainElement.style.height = this.tefudaStyles[index].height;
      skill.mainElement.style.transform = this.tefudaStyles[index].transform;
      this.container.appendChild(skill.mainElement);
    });
  }

  /**
   * 山札から新しい skill を一枚引く
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
    const usedSkill = this.findById(usedSkillId);
    usedSkill.state = Skills.STATES.SUTEFUDA;

    // style を引き継いで要素を更新する
    const index = usedSkill.tefudaStylesIndex;
    usedSkill.tefudaStylesIndex = null;
    nextSkill.tefudaStylesIndex = index;
    nextSkill.mainElement.style.width = this.tefudaStyles[index].width;
    nextSkill.mainElement.style.height = this.tefudaStyles[index].height;
    nextSkill.mainElement.style.transform = this.tefudaStyles[index].transform;
    this.container.replaceChild(nextSkill.mainElement, usedSkill.mainElement);
  }

  /**
   * 手札をすべて捨てて引き直す
   */
  reshuffle(usedSkillId) {
    // 使用 skill 以外の手札を捨札に
    this.tefudas
      .filter(skill => skill.id !== usedSkillId)
      .forEach(skill => {
        skill.tefudaStylesIndex = null;
        skill.state = Skills.STATES.SUTEFUDA;
      });

    for (let i = 0; i < 8; i++) {
      // 山札が0枚の場合は捨て札を山札に戻す
      if (this.yamafudas.length === 0) {
        this.sutefudas.forEach(skill => {
          skill.state = Skills.STATES.YAMAFUDA;
        });
      }

      // 山札から skill を一枚ランダムに引く
      const nextSkill = shuffleArray(this.yamafudas)[0];
      nextSkill.state = Skills.STATES.TEFUDA;
    }

    // 使用 skill を捨札に
    const usedSkill = this.findById(usedSkillId);
    usedSkill.tefudaStylesIndex = null;
    usedSkill.state = Skills.STATES.SUTEFUDA;

    // 手札を描画
    this.appendTefudasToContainer();
  }

  /**
   * 山札に dress を追加する
   */
  dress(usedSkillId) {
    const usedSkill = this.findById(usedSkillId);
    usedSkill.usedCnt++;
    const scale = getScale();

    this.findById(usedSkillId).dressSrcs.forEach((src, index) => {
      const skillId = `${usedSkillId}-${usedSkill.usedCnt}-${index}`;
      // メイン画面用
      const mainElement = createSkillElement(skillId, src);
      mainElement.onclick = () => {
        this.drawSkill(mainElement.id);
        const skillsIndex = this.skills.findIndex(skill => skill.id === mainElement.id);
        this.skills.splice(skillsIndex, 1);
        addDressElement(usedSkill.dressOnlySrc);
        updateModalOpenButton(this);
      }

      // カード確認画面用
      const confirmSkillModalElementImg = createSkillElement(`confirm-skill-modal-skill-${skillId}`, src);
      confirmSkillModalElementImg.style.width = `${SKILL_ORIGINAL_WIDTH * SKILL_DEFAULT_SCALE * scale}px`;
      confirmSkillModalElementImg.style.height = "auto";
      confirmSkillModalElementImg.onclick = () => openReplaceSkillModal(this, skillId);
      const confirmSkillModalElement = document.createElement("li");
      confirmSkillModalElement.appendChild(confirmSkillModalElementImg);

      // カード入替画面用
      const replaceSkillModalElementImg = createSkillElement(`replace-skill-modal-skill-${skillId}`, src);
      replaceSkillModalElementImg.style.width = `${SKILL_ORIGINAL_WIDTH * SKILL_DEFAULT_SCALE * scale}px`;
      replaceSkillModalElementImg.style.height = "auto";
      replaceSkillModalElementImg.onclick = () => {
        const replaceFromSkillId = document.getElementById("replace-skill-modal-replace-from").querySelector("img").id;
        this.replace(replaceFromSkillId, skillId);
        closeReplaceSkillModal();
      };  
      const replaceSkillModalElement = document.createElement("li");
      replaceSkillModalElement.appendChild(replaceSkillModalElementImg);

      const replaceFromElement = document.createElement("img");
      replaceFromElement.id = skillId;
      replaceFromElement.src = src;
      replaceFromElement.style.width = `${SKILL_ORIGINAL_WIDTH * scale}px`;
      replaceFromElement.style.height = "auto";

      this.skills.push({
        id: skillId,
        state: Skills.STATES.YAMAFUDA,
        mainElement,
        confirmSkillModalElement,
        replaceSkillModalElement,
        replaceFromElement,
      })
    })

    this.drawSkill(usedSkillId);
  }

  /**
   * skillid1 と skillId2 の state を入れ替える
   */
  replace(skillId1, skillId2) {
    const skill1 = this.findById(skillId1);
    const skill2 = this.findById(skillId2);
    [skill1.state, skill2.state] = [skill2.state, skill1.state];

    // モーダルの画像を切り替え
    const skill1Confirm = skill1.confirmSkillModalElement;
    const skill1ConfirmParent = skill1Confirm.parentNode;
    const skill1ConfirmNextSibling = skill1Confirm.nextSibling;
    const skill2Confirm = skill2.confirmSkillModalElement;
    const skill2ConfirmParent = skill2Confirm.parentNode;
    const skill2ConfirmNextSibling = skill2Confirm.nextSibling;
    skill1ConfirmParent.removeChild(skill1Confirm);
    skill1ConfirmNextSibling
      ? skill1ConfirmParent.insertBefore(skill2Confirm, skill1ConfirmNextSibling)
      : skill1ConfirmParent.appendChild(skill2Confirm);
    skill2ConfirmNextSibling
      ? skill2ConfirmParent.insertBefore(skill1Confirm, skill2ConfirmNextSibling)
      : skill2ConfirmParent.appendChild(skill1Confirm);

    // 手札を描画
    this.appendTefudasToContainer();
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

/**
 * min から max の範囲でランダムな整数を返す
 */
const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * scale を取得する
 */
const getScale = () => {
  const clientWidth = document.getElementsByClassName("container")[0].clientWidth;
  const scale = clientWidth / SKILL_CONTAINER_ORIGINAL_WIDTH;
  return scale;
}

/**
 * skillElement をつくる
 */
const createSkillElement = (id, src) => {
  const skillElement = document.createElement("img");
  skillElement.id = id;
  skillElement.src = src;
  skillElement.classList.add("skill");
  return skillElement;
}

/**
 * dressElement をロゴの周辺に配置する
 */
const addDressElement = (src) => {
  const dressElement = document.createElement("img");
  dressElement.src = src;
  dressElement.classList.add("dress");

  // ロゴを揺らす
  const logoElement = document.getElementById("logo");
  logoElement.classList.add("shake-img");
  setTimeout(() => {
    logoElement.classList.remove("shake-img");
  }, 300);

  // container 中にランダムに配置する
  const container = document.querySelector(".container");
  const { clientWidth, clientHeight } = container;
  dressElement.style.top = `${randomInt(0, clientHeight - 60)}px`;
  dressElement.style.left = `${randomInt(0, clientWidth - 60)}px`;

  container.appendChild(dressElement);
}

/**
 * ツイート文言を更新する
 */
const setTweetLink = (e) => {
  const dressCnt = document.getElementsByClassName("dress").length;
  const text = encodeURIComponent(`${HELLOMEG_DRESS_HASHTAG}\n${HELLOMEG_DRESS_TWEET}\n\n${dressCnt}着！\n`);
  e.href = `${TWEET_INTENT_URL}?text=${text}&url=${HELLOMEG_DRESS_URL}`;
}
