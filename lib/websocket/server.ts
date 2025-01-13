import { AuthenticatedWebSocket, WebSocketMessage } from './types';
import { TokenManager } from './token';

export class WebSocketServer {
  private clients: Set<AuthenticatedWebSocket>;

  constructor() {
    this.clients = new Set();
  }

  public async connect() {
    try {
      const token = await TokenManager.getTempToken();
      const wsUrl = process.env.NEXT_PUBLIC_WS_URL;

      if (!wsUrl) {
        throw new Error('WebSocket URL is not configured');
      }

      const wsEndpoint = wsUrl.replace(/^http/, 'ws');
      const fullWsUrl = `${wsEndpoint}/subscribe/decoded/events?token=${encodeURIComponent(
        token
      )}`;

      const ws = new WebSocket(fullWsUrl);
      this.handleConnection(ws as AuthenticatedWebSocket);
    } catch (error) {
      console.error('[WebSocket] Connection failed:', error);
      throw error;
    }
  }

  private handleConnection(ws: AuthenticatedWebSocket) {
    this.clients.add(ws);
    console.log('[WebSocket] New client connected');

    ws.addEventListener('message', (event) =>
      this.handleMessage(ws, event.data)
    );
    ws.addEventListener('close', () => this.handleClose(ws));
    ws.addEventListener('error', (error) => this.handleError(ws, error));
  }

  private async handleMessage(ws: AuthenticatedWebSocket, data: string) {
    try {
      const message: WebSocketMessage = JSON.parse(data);
      await this.broadcastMessage(message);
    } catch (error) {
      console.error('[WebSocket] Message handling error:', error);
    }
  }

  private async broadcastMessage(message: WebSocketMessage) {
    const messageString = JSON.stringify(message);
    const failedClients = new Set<AuthenticatedWebSocket>();

    for (const client of Array.from(this.clients)) {
      if (client.readyState === WebSocket.OPEN) {
        try {
          await client.send(messageString);
        } catch (error) {
          console.error('[WebSocket] Broadcast error:', error);
          failedClients.add(client);
        }
      }
    }

    failedClients.forEach((client) => this.clients.delete(client));
  }

  private handleClose(ws: AuthenticatedWebSocket) {
    this.clients.delete(ws);
    console.log('[WebSocket] Client disconnected');
  }

  private handleError(ws: AuthenticatedWebSocket, error: Event) {
    console.error('[WebSocket] Client error:', error);
  }
}
