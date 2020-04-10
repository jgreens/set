const socketIO = require('socket.io');
const app = require('./app');

const connect = expressServer => {
    const io = socketIO.listen( expressServer );
    io.set('transports', ['websocket']);
    io.on('connection', clientConnected);
};

// Utility function to create messages with id numbers (used for acks)
let msgCount = 0;
const createMessage = (msgType, data) => {
    const obj = {
        msgId: msgCount++,
        msgType: msgType,
        data: data
    }
    console.log( 'Sending message: ' );
    console.log( obj );
    return obj;
};

//var handleJavaData = function( msg ) {
//    var msgObj = JSON.parse(msg);
//    console.log( 'Processed message ' + msgObj.msgId + ': ' + msgObj.msgType );
//    console.log( msgObj.data );
//
//    var data = msgObj.data;
//    switch( msgObj.msgType ) {
//        case 'ack':
//            break;
//        case 'GAME CREATE SUCCESS':
//            var obj = { id: data.gameId };
//            connectedClients[ data.clientId ].emit( 'GAME CREATE ACK', obj );
//            break;
//        case 'GAME JOIN SUCCESS':
//            connectedClients[ data.clientId ].emit( 'GAME JOIN ACK', true );
//            break;
//        case 'GAME JOIN FAIL':
//            connectedClients[ data.clientId ].emit( 'GAME JOIN ACK', false );
//            break;
//        case 'GAME DELETE SUCCESS':
//            // TODO: This should send game members back to the lobby
//            for ( var i = 0; i < data.clients.length; ++i ) {
//                connectedClients[ data.clients[i] ].emit( 'GAME DELETE ACK', true );
//            }
//            break;
//        case 'GAME DELETE FAIL':
//            // TODO: This should show some sort of error message and stop the button load state
//            connectedClients[ data.clientId ].emit( 'GAME DELETE ACK', false );
//            break;
//        case 'GAME LEAVE SUCCESS':
//            connectedClients[ data.clientId ].emit( 'GAME LEAVE ACK', true );
//            break;
//        case 'GAME LEAVE FAIL':
//            connectedClients[ data.clientId ].emit( 'GAME LEAVE ACK', false );
//            break;
//        case 'GAME START SUCCESS':
//            connectedClients[ data.clientId ].emit( 'GAME START ACK', true );
//            break;
//        case 'GAME SET SUCCESS':
//            connectedClients[ data.clientId ].emit( 'GAME SET ACK', true );
//            break;
//        case 'GAME SET INVALID':
//            connectedClients[ data.clientId ].emit( 'GAME SET ACK', false );
//            break;
//        case 'GAME SET FAIL':
//            connectedClients[ data.clientId ].emit( 'GAME SET ACK', false );
//            break;
//        case 'GAME UPDATE':
//            for ( var i = 0; i < data.clients.length; ++i ) {
//                connectedClients[ data.clients[i] ].emit( 'GAME UPDATE', data );
//            }
//            break;
//        default:
//            console.log( 'Unhandled message: ' + msgObj );
//            break;
//    }
//};

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

    socket.on( 'GAME DELETE', data => {
        var obj = createMessage( 'GAME DELETE', {
            clientId: socket.id,
            gameId: data.id
        });
        console.log( JSON.stringify( obj ) + '\n' );
    });

    socket.on( 'GAME START', data => {
        var obj = createMessage( 'GAME START', {
            clientId: socket.id,
            gameId: data.id
        });
        console.log( JSON.stringify( obj ) + '\n' );
    });

    socket.on( 'GAME LEAVE', data => {
        const success = app.leaveGame(data.id, socket.id);

        connectedClients[socket.id].emit('GAME LEAVE ACK', success);
    });

    socket.on( 'GAME SET', data => {
        var obj = createMessage( 'GAME SET', {
            clientId: socket.id,
            gameId: data.id,
            cards: data.set
        });
        console.log( JSON.stringify( obj ) + '\n' );
    });

    socket.on( 'GAME FEED', data => {
        var obj = createMessage( 'GAME FEED MESSAGE', {
            gameId: data.id,
            username: data.user,
            msgType: data.type,
            data: data.message
        });
        console.log( JSON.stringify( obj ) + '\n' );
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
