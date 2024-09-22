import { DurableObject } from "cloudflare:workers";

export async function onRequest({ request, env }) {
  const upgradeHeader = request.headers.get('Upgrade');
  if (!upgradeHeader || upgradeHeader !== 'websocket') {
    return new Response('Durable Object expected Upgrade: websocket', { status: 426 });
  }

  const obj = env.WEBSOCKET_SERVER.idFromName("test");
  return obj.fetch(request);
}

export class WebSocketServer extends DurableObject {
  async fetch(request) {
    const webSocketPair = new WebSocketPair();
    const [client, server] = Object.values(webSocketPair);
    this.ctx.acceptWebSocket(server);
    return new Response(null, { status: 101, webSocket: client });
  }

  async webSocketMessage(socket, message) {
    socket.send(`[Durable Object] message: ${message}, connections: ${this.ctx.getWebSockets().length}`);
  }

  async webSocketClose(socket, code, reason, wasClean) {
    // If the client closes the connection, we will close it too.
    socket.close(code, "Durable Object is closing WebSocket");
  }
}
