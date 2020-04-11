const socketIO = require('socket.io');
const app = require('./app');

const connect = expressServer => {
    const io = socketIO.listen( expressServer );
    io.set('transports', ['websocket']);
    io.on('connection', clientConnected);
};

const connectedClients = {};

const clientConnected = socket => {
    console.log(`Received connection with id ${socket.id} from address ${socket.client.conn.remoteAddress}`);

    connectedClients[socket.id] = socket;
    connectedClients[socket.id].emit('CLIENT CONNECT ACK', true);

    socket.on( 'disconnect', () => {
        app.deleteUser(socket.id);

        delete connectedClients[socket.id]
    });

    socket.on( 'USER LOGIN', data => {
        const user = app.createUser(socket.id);

        const obj = {};

        if (!user) {
            obj.success = false;
            obj.errorMessage = 'Failed to create user';

            console.error(`Failed to create user for client with id ${socket.id}`);
        } else {
            obj.success = true;
            obj.nickname = user.nickname;

            console.log(`Client with id ${socket.id} logged in as ${obj.nickname}`);
        };

        connectedClients[socket.id].emit( 'USER LOGIN ACK', obj );
    });

    socket.on( 'USER LOGOUT', data => {
        const success = Boolean(app.deleteUser(socket.id));

        if (!success) {
            console.error(`Failed to log out client with id ${socket.id}`);
        } else {
            console.log(`Client with id ${socket.id} logged out`);
        }

        connectedClients[socket.id].emit('USER LOGOUT ACK', success);
    });

    socket.on( 'LOBBY LIST', () => {
        const data = app.getLobbyData();

        connectedClients[socket.id].emit('LOBBY LIST ACK', data);
    });

    socket.on( 'GAME CREATE', data => {
        const gameData = app.createGame(socket.id, data.name);

        connectedClients[socket.id].emit('GAME CREATE ACK', gameData);
    });

    socket.on( 'GAME JOIN', data => {
        const success = app.joinGame(data.id, socket.id);

        connectedClients[socket.id].emit('GAME JOIN ACK', success);
    });

    socket.on( 'GAME UPDATE INIT', data => {
        const gameData = app.triggerGameUpdate(data.id);
    });

    socket.on( 'GAME START', data => {
        const success = app.startGame(data.id, socket.id);

        connectedClients[socket.id].emit('GAME START ACK', success);
    });

    socket.on( 'GAME LEAVE', data => {
        const success = app.leaveGame(data.id, socket.id);

        connectedClients[socket.id].emit('GAME LEAVE ACK', success);
    });

    socket.on( 'GAME SET', data => {
        const result = app.evaluateSet(data.id, socket.id, data.set);

        connectedClients[socket.id].emit('GAME SET ACK', result);
    });

    socket.on( 'GAME FEED', data => {
        app.sendGameFeedMessage(data.id, socket.id, data.type, data.message);
    });
};

app.connectBroadcaster((clients, eventType, data) => {
    console.log(`Broadcasting ${eventType}`, JSON.stringify(data, null, 2));

    for (const clientId of clients) {
        if (!connectedClients[clientId]) {
            console.warn(`Attempted to send message of type ${eventType} to unknown client`);
            return;
        }
        connectedClients[clientId].emit(eventType, data);
    }
});

module.exports = {
    connect,
};
