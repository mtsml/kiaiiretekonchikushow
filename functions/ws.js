export default {
  async fetch(request, env) {
    const upgradeHeader = request.headers.get('Upgrade');

    // 426 Upgrade Required
    if (!upgradeHeader || upgradeHeader !== 'websocket') {
      return new Response('Durable Object expected Upgrade: websocket', { status: 426 });
    }

    const [client, server] = Object.values(new WebSocketPair());
    await handleSession(server);
  
    return new Response(null, {
      status: 101,
      webSocket: client,
    });
  }
};

let count = 0;

async function handleSession(websocket) {
  websocket.accept();
  websocket.addEventListener("message", async ({ data }) => {
    if (data === "CLICK") {
      count += 1
      websocket.send(JSON.stringify({ count, tz: new Date() }));
    }
  });

  websocket.addEventListener("close", async (event) => {
    console.log(event);
  });
}