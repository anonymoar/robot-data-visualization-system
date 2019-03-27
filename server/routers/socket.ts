import { Server } from 'socket.io';

export function setupSocketServers(browserServer: Server, robotServer: Server) {
  browserServer.on('connection', socket => {
    console.log('User connected');

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

  const browserLogsNamespace = browserServer.of('/logs');
  browserLogsNamespace.on('connection', socket => {
    console.log('[logs] User connected');

    socket.on('disconnect', () => {
      console.log('[logs] User disconnected');
    });
  });

  const browserChartsNamespace = browserServer.of('/charts');
  browserChartsNamespace.on('connection', socket => {
    console.log('[charts] User connected');

    socket.on('disconnect', () => {
      console.log('[chart] User disconnected');
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
      browserLogsNamespace.emit('log record', data);
    });

    socket.on('disconnect', () => {
      console.log('[logs] Robot disconnected');
    });
  });

  robotServer.of('/charts').on('connection', socket => {
    console.log('[charts] Robot connected');

    // TODO: Изменить any на интерфейс описывающий точку
    socket.on('chart point', (data: any) => {
      console.log(`[charts] chart point "${JSON.stringify(data)}" received`);
      browserChartsNamespace.emit('chart point', data);
    });

    socket.on('disconnect', () => {
      console.log('[chart] Robot disconnected');
    });
  });
}
