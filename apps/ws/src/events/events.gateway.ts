import { UserModel } from '@geveze/db';
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

        const rooms = this.server.of('/').adapter.rooms.get(user._id);
        if (!rooms) {
          UserModel.findOneAndUpdate(
            { _id: user._id, isOnline: false },
            { isOnline: true },
          );
        }

        socket.join(user._id);
        socket.data = user;
        next();
      } catch (error) {
        new Error('');
      }
    });
  }

  handleDisconnect(client: Socket) {
    client.data;
    const rooms = this.server.of('/').adapter.rooms.get(client.data._id);
    if (!rooms) {
      UserModel.findOneAndUpdate({ _id: client.data._id }, { isOnline: false });
    }
  }
}
