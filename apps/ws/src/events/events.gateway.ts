import { JwtService } from '@nestjs/jwt';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  constructor(private jwtService: JwtService) {}

  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    server.engine.on('connection', (rawSocket) => {
      rawSocket.request = null;
    });

    server.use(async (socket: Socket, next) => {
      try {
        const { token } = socket.handshake.auth;

        if (!token) return next(new Error(''));

        const user = await this.jwtService.verifyAsync(token);

        socket.join(user._id.toString());
        next();
      } catch (error) {
        console.log(error);
        new Error('');
      }
    });
  }

  async handleConnection(client: Socket) {}

  handleDisconnect(client: Socket) {}
}
