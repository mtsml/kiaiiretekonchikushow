let offset = 565;

const startGame = (target) => {
  document.getElementById("gauge-container").style.display = null;
  document.getElementById("description").style.display = "none";

  const gauge = document.getElementById('progress-circle');

  const timer = new PausableTimer((isEnded) => {
    offset -= 10;
    if (offset <= 0) {
      timer.end();
      gauge.style.display = "none";
    }
    if (!isEnded) {
      gauge.style.strokeDashoffset = offset;
    }
  });

  target.onclick = () => timer.end();

  timer.start();
}

/**
 * timer 管理
 */
class PausableTimer {
  constructor(callback) {
    this.callback = callback;
    this.timerId = null;
    this.startTime = 0;
    this.elapsed = 0;
    this.isPaused = true;
    this.isEnded = false;
  }

  start() {
    if (!this.isPaused || this.isEnded) return;
    this.isPaused = false;
    this.startTime = Date.now() - this.elapsed;
    this.timerId = setInterval(() => {
      this.elapsed = Date.now() - this.startTime;
      this.callback(this.isEnded);
    }, 10);
  }

  pause() {
    if (this.isPaused || this.isEnded) return;
    this.isPaused = true;
    clearInterval(this.timerId);
    this.timerId = null;
  }

  end() {
    this.pause();
    this.isEnded = true;
  }
}

let ws;

const handleClick = async (target) => {
  target.onclick = () => {
    ws.send(JSON.stringify("hoge"));
  }
  const url = new URL(window.location);
  url.protocol = "wss";
  url.pathname = "/api/ws";
  await websocket(url);
}

const websocket = async (url) => {
  ws = new WebSocket(url);

  if (!ws) {
    throw new Error("server didn't accept ws")
  }

  ws.addEventListener("open", () => {
    console.log('Opened websocket');
  })

  ws.addEventListener("message", ({ data }) => {
    console.log(JSON.parse(data))
  })
}
