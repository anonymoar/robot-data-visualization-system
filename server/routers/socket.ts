import { Server } from 'socket.io';

export function setupSocketServers(browserServer: Server, robotServer: Server) {
  browserServer.on('connection', socket => {
    console.log('User connected');

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

  robotServer.on('connection', socket => {
    console.log('Robot connected');

    socket.on('disconnect', () => {
      console.log('Robot disconnected');
    });
  });

  robotServer.of('/logs').on('connection', socket => {
    console.log('[logs] Robot connected');

    socket.on('log record', (data: string) => {
      console.log(`[logs] Log record "${data}" received`);
      browserServer.emit('log record', data);
    });

    socket.on('disconnect', () => {
      console.log('[logs] Robot disconnected');
    });
  });
}
