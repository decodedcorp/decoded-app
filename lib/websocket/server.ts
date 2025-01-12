import { WebSocketServer } from 'ws';
import { IncomingMessage } from 'http';
import WebSocket from 'ws';

interface WebSocketMessage {
  type: string;
  event?: string;
  data?: any;
  timestamp?: string;
}

interface AuthenticatedWebSocket extends WebSocket {
  isAlive: boolean;
  userId?: string;
  isAuthenticated: boolean;
}

const HEARTBEAT_INTERVAL = 30000;

export class WebSocketHandler {
  private wss: WebSocketServer;
  private clients: Set<AuthenticatedWebSocket>;

  constructor(port: number) {
    this.wss = new WebSocketServer({ port });
    this.clients = new Set();
    this.setupWebSocketServer();
    this.startHeartbeat();
  }

  private setupWebSocketServer() {
    this.wss.on('connection', (ws: AuthenticatedWebSocket, req: IncomingMessage) => {
      // 초기 연결 설정
      ws.isAlive = true;
      ws.isAuthenticated = false;
      this.clients.add(ws);

      // URL에서 토큰 추출
      const url = new URL(req.url || '', 'ws://localhost');
      const token = url.searchParams.get('token');

      if (token) {
        // 실제로는 토큰을 검증하고 userId를 추출해야 함
        const userId = 'temp';
        ws.userId = userId;
        ws.isAuthenticated = true;

        // 인증 성공 메시지 전송
        ws.send(JSON.stringify({
          type: 'auth',
          status: 'success',
          timestamp: new Date().toISOString()
        }));
      }

      // 메시지 핸들링 설정
      ws.on('message', (data: string) => this.handleMessage(ws, data));
      ws.on('pong', () => { ws.isAlive = true; });
      ws.on('close', () => this.handleClose(ws));
      ws.on('error', () => this.handleError(ws));

      // 인증되지 않은 경우에만 타임아웃 설정
      if (!ws.isAuthenticated) {
        const authTimeout = setTimeout(() => {
          if (!ws.isAuthenticated) {
            ws.close(4001, 'Authentication timeout');
          }
        }, 5000);

        // 연결이 닫히면 타임아웃 제거
        ws.on('close', () => clearTimeout(authTimeout));
      }
    });
  }

  private handleMessage(ws: AuthenticatedWebSocket, data: string) {
    try {
      const message: WebSocketMessage = JSON.parse(data);

      // 인증 메시지 처리
      if (message.type === 'auth') {
        this.handleAuth(ws, message);
        return;
      }

      // 인증되지 않은 클라이언트의 다른 메시지는 무시
      if (!ws.isAuthenticated) {
        ws.close(4001, 'Not authenticated');
        return;
      }

      // 인증된 클라이언트의 ping 메시지 처리
      if (message.type === 'ping') {
        ws.send(JSON.stringify({ 
          type: 'pong', 
          timestamp: new Date().toISOString() 
        }));
        return;
      }

    } catch {

    }
  }

  private handleAuth(ws: AuthenticatedWebSocket, message: WebSocketMessage) {
    const token = message.data?.token;
    const userId = message.data?.userId;

    if (!token || !userId) {
      ws.close(4001, 'Invalid authentication data');
      return;
    }

    // 여기서는 토큰과 userId가 제공되었다는 것만으로 인증 성공으로 처리
    // 실제로는 토큰 검증 로직이 필요할 수 있음
    ws.userId = userId;
    ws.isAuthenticated = true;

    // 인증 성공 메시지 전송
    ws.send(JSON.stringify({
      type: 'auth',
      status: 'success',
      timestamp: new Date().toISOString()
    }));
  }

  private handleClose(ws: AuthenticatedWebSocket) {
    this.clients.delete(ws);
  }

  private handleError(ws: AuthenticatedWebSocket) {
    this.clients.delete(ws);
  }

  private startHeartbeat() {
    setInterval(() => {
      this.clients.forEach(ws => {
        if (!ws.isAlive) {
          ws.terminate();
          this.clients.delete(ws);
          return;
        }

        ws.isAlive = false;
        ws.ping();
      });
    }, HEARTBEAT_INTERVAL);
  }

  // Method to broadcast message to all authenticated clients
  public broadcast(message: WebSocketMessage) {
    const messageString = JSON.stringify({
      ...message,
      timestamp: new Date().toISOString()
    });

    this.clients.forEach(client => {
      if (client.isAuthenticated && client.readyState === WebSocket.OPEN) {
        client.send(messageString);
      }
    });
  }

  // Method to send message to specific authenticated user
  public sendToUser(userId: string, message: WebSocketMessage) {
    const messageString = JSON.stringify({
      ...message,
      timestamp: new Date().toISOString()
    });

    this.clients.forEach(client => {
      if (client.isAuthenticated && client.userId === userId && client.readyState === WebSocket.OPEN) {
        client.send(messageString);
      }
    });
  }
} 