let ws;

const websocket = async (url) => {
  ws = new WebSocket(url);

  if (!ws) {
    throw new Error("server didn't accept ws")
  }

  ws.addEventListener("open", () => {
    console.log('Opened websocket');
  })

  ws.addEventListener("message", ({ data }) => {
    const { count, tz, error } = JSON.parse(data)
  })
}

const url = new URL(window.location);
url.protocol = "wss";
url.pathname = "/ws";
websocket(url);
