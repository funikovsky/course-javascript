const WebSocket = require('ws');
const wsServer = new WebSocket.Server({ port: 9000 });

wsServer.on('connection', onConnect);

const connections = new Map();

function onConnect(socket) {
  connections.set(socket, {});
  console.log('Новый пользователь подключился');

  socket.on('message', function (stringMessage) {
    const message = JSON.parse(stringMessage);
    let excludeItself = false;

    if (message.type === 'hello') {
      excludeItself = true;
      connections.get(socket).userName = message.user;

      sendMessageTo(
        {
          type: 'user-list',
          data: [...connections.values()].map((item) => item.userName).filter(Boolean),
        },
        connections
      );
    }
    if (message.type === 'image') {
      connections.get(socket).userImageUrl = message.url;
    }

    sendMessageFrom(message, socket, excludeItself);
  });

  socket.on('close', function () {
    sendMessageFrom({ type: 'bye' }, socket);

    connections.delete(socket);
    sendMessageTo(
      {
        type: 'user-list',
        data: [...connections.values()].map((item) => item.userName).filter(Boolean),
      },
      connections
    );
  });
}

function sendMessageFrom(message, client, excludeSelf) {
  const socketData = connections.get(client);
  message.name = socketData.userName;

  for (const connection of connections.keys()) {
    if (connection === client && excludeSelf) {
      continue;
    }
    connection.send(JSON.stringify(message));
  }
}

function sendMessageTo(message, connections) {
  for (const connection of connections.keys()) {
    connection.send(JSON.stringify(message));
  }
}

console.log('Веб сервер запущен на порту 9000');
