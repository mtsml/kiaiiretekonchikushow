const TWEET_INTENT_URL = "https://twitter.com/intent/tweet";
const HELLOMEG_WS_HASHTAG = "#ハロめぐWS";
const HELLOMEG_WS_TWEET = "tbd";
const HELLOMEG_WS_URL = "https://kiaiiretekonchiku.show/ws/";
const KIAKON_WORKER_WS_URL = "http://localhost:8787/ws";
// const KIAKON_WORKER_WS_URL = "https://api.kiaiiretekonchiku.show/ws";
const KIAKON_WORKER_WS_TYPES = {
  HELLOMEG: "HELLOMEG",
  INCREMENT_USER_CNT: "INCREMENT_USER_CNT",
};

let ws;

const connectWebSocketServer = async () => {
  ws = new WebSocket(KIAKON_WORKER_WS_URL);

  if (!ws) {
    // TODO: 画面表示を変える
    throw new Error("server didn't accept ws");
  }

  ws.addEventListener("open", () => {
    ws.send(JSON.stringify({ type: KIAKON_WORKER_WS_TYPES.INCREMENT_USER_CNT }));
  });

  ws.addEventListener("message", ({ data }) => {
    const { type, payload } = JSON.parse(data);
    switch (type) {
      case KIAKON_WORKER_WS_TYPES.HELLOMEG:
        const hellomegElement = document.getElementById("hellomeg");
        hellomeg(hellomegElement);
        break;
      case KIAKON_WORKER_WS_TYPES.INCREMENT_USER_CNT:
        const userCnt = document.getElementById("user-cnt");
        userCnt.innerHTML = `アクティブハロめぐ：${payload}`;
        break;
    }
  });
}

const handleClick = async (target) => {
  target.onclick = null;
  document.getElementById("description").style.display = "none";
  await connectWebSocketServer();
  target.onclick = () => {
    ws.send(JSON.stringify({ type: KIAKON_WORKER_WS_TYPES.HELLOMEG }));
  }
}

/**
 * target から「ハロめぐー！」をランダムな方向に射出する
 */
const hellomeg = (target) => {
  // target を揺らす
  target.classList.add("shake-img");
  setTimeout(() => {
    target.classList.remove("shake-img");
  }, 300);

  const hellomegElement = document.createElement("div");
  hellomegElement.textContent = "ハロめぐー！";
  hellomegElement.classList.add("hellomeg");

  // container の中心から外側に向かってランダムに飛び出す
  const randomAngle = Math.random() * 2 * Math.PI;
  const translateX = Math.cos(randomAngle) * 180;
  const translateY = Math.sin(randomAngle) * 180;
  hellomegElement.style.setProperty("--translateX", translateX + "px");
  hellomegElement.style.setProperty("--translateY", translateY + "px");
  hellomegElement.style.setProperty("--startX", Math.cos(randomAngle) * 20 + "%");
  hellomegElement.style.setProperty("--startY", Math.sin(randomAngle) * 20 + "%");

  const container = document.querySelector(".c-container");
  container.appendChild(hellomegElement);

  // animation 完了後に要素を削除する
  setTimeout(() => {
    hellomegElement.remove();
  }, 2000);
}
