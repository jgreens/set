var express = require( 'express' );
var http = require( 'http' );
var socketIO = require( 'socket.io' );
var net = require( 'net' );
var path = require( 'path' );


/*
 * Express
 */
var app = express();
app.use(express.static(path.join(__dirname, "../public_html")));
var expressServer = app.listen(3000, function() {
    console.log( 'listening on *:3000' );
});


/*
 * Node - Java Socket Connection
 */
// Utility function to create messages with id numbers (used for acks)
var msgCount = 0;
var createMessage = function( msgType, data ) {
    var obj = {
        msgId: msgCount++,
        msgType: msgType,
        data: data
    }
    console.log( 'Sending message: ' );
    console.log( obj );
    return obj;
};

// Node-Java socket connection event handling
const client = net.connect( 1010, 'localhost' );
client.on( 'connect', function() {
    // 'connect' listener
    var obj = createMessage( "nodeConnect", { msg: "connected to server!" } );
    client.write( JSON.stringify( obj ) + '\n' );
});
client.on( 'end', function() {
    console.log( 'disconnected from server' );
});

client.on( 'data', function( msg ) {
    var msgs = msg.toString().split('\n');
    for ( var i = 0; i < msgs.length; ++i ) {
        if (msgs[i].length) {
            handleJavaData(msgs[i]);
        }
    }
});

var handleJavaData = function( msg ) {
    var msgObj = JSON.parse(msg);
    console.log( 'Processed message ' + msgObj.msgId + ': ' + msgObj.msgType );
    console.log( msgObj.data );

    var data = msgObj.data;
    switch( msgObj.msgType ) {
        case 'ack':
            break;
        case 'USER LOGIN SUCCESS':
            var obj = { user: data.username, id: data.clientId };
            connectedClients[ data.clientId ].emit( 'USER LOGIN ACK', obj );
            break;
        case 'USER LOGIN FAIL':
            connectedClients[ data.clientId ].emit( 'USER LOGIN ACK', false );
            break;
        case 'USER LOGOUT SUCCESS':
            connectedClients[ data.clientId ].emit( 'USER LOGOUT ACK', true );
            break;
        case 'USER LOGOUT FAIL':
            connectedClients[ data.clientId ].emit( 'USER LOGOUT ACK', false );
            break;
        case 'LOBBY UPDATE':
            for ( var i = 0; i < data.clients.length; ++i ) {
                if ( connectedClients[ data.clients[i] ] ) {
                    connectedClients[ data.clients[i] ].emit( 'LOBBY UPDATE', data.games );
                }
            }
            break;
        case 'GAME CREATE SUCCESS':
            var obj = { id: data.gameId };
            connectedClients[ data.clientId ].emit( 'GAME CREATE ACK', obj );
            break;
        case 'GAME JOIN SUCCESS':
            connectedClients[ data.clientId ].emit( 'GAME JOIN ACK', true );
            break;
        case 'GAME JOIN FAIL':
            connectedClients[ data.clientId ].emit( 'GAME JOIN ACK', false );
            break;
        case 'GAME DELETE SUCCESS':
            // TODO: This should send game members back to the lobby
            for ( var i = 0; i < data.clients.length; ++i ) {
                connectedClients[ data.clients[i] ].emit( 'GAME DELETE ACK', true );
            }
            break;
        case 'GAME DELETE FAIL':
            // TODO: This should show some sort of error message and stop the button load state
            connectedClients[ data.clientId ].emit( 'GAME DELETE ACK', false );
            break;
        case 'GAME LEAVE SUCCESS':
            connectedClients[ data.clientId ].emit( 'GAME LEAVE ACK', true );
            break;
        case 'GAME LEAVE FAIL':
            connectedClients[ data.clientId ].emit( 'GAME LEAVE ACK', false );
            break;
        case 'GAME START SUCCESS':
            connectedClients[ data.clientId ].emit( 'GAME START ACK', true );
            break;
        case 'GAME SET SUCCESS':
            connectedClients[ data.clientId ].emit( 'GAME SET ACK', true );
            break;
        case 'GAME SET INVALID':
            connectedClients[ data.clientId ].emit( 'GAME SET ACK', false );
            break;
        case 'GAME SET FAIL':
            connectedClients[ data.clientId ].emit( 'GAME SET ACK', false );
            break;
        case 'GAME UPDATE':
            for ( var i = 0; i < data.clients.length; ++i ) {
                connectedClients[ data.clients[i] ].emit( 'GAME UPDATE', data );
            }
            break;
        default:
            console.log( 'Unhandled message: ' + msgObj );
            break;
    }
};

/*
 * Node - Browser Socket Connection (socket.io)
 */
var io = require( 'socket.io' ).listen( expressServer );
var connectedClients = {};
io.on( 'connection', function( socket ) {
    var obj = createMessage( 'CLIENT CONNECT', { clientId: socket.id } );
    connectedClients[socket.id] = socket;
    client.write( JSON.stringify( obj ) + '\n' );

    socket.on( 'disconnect', function() {
        var obj = createMessage( 'CLIENT DISCONNECT', { clientId: socket.id } );
        delete connectedClients[socket.id]
        client.write( JSON.stringify( obj ) + '\n' );
    });

    socket.on( 'USER REGISTER', function(data) {
        var obj = createMessage( 'USER REGISTER', {
            clientId: socket.id,
            username: data.username,
            password: data.password,
        });
        client.write( JSON.stringify( obj ) + '\n' );

        socket.emit( 'USER REGISTER ACK', true );
    });

    socket.on( 'USER LOGIN', function(data) {
        var obj = createMessage( 'USER LOGIN', {
            clientId: socket.id,
            username: data.username,
            password: data.password,
        });
        client.write( JSON.stringify( obj ) + '\n' );
    });

    socket.on( 'USER LOGOUT', function(data) {
        var obj = createMessage( 'USER LOGOUT', {
            clientId: socket.id,
            username: data.name
        });
        client.write( JSON.stringify( obj ) + '\n' );
    });

    socket.on( 'LOBBY LIST', function() {
        var obj = createMessage( 'LOBBY LIST', {} );
        client.write( JSON.stringify( obj ) + '\n' );
    });

    socket.on( 'GAME CREATE', function(data) {
        var obj = createMessage( 'GAME CREATE', {
            clientId: socket.id,
            name: data.name
        });
        client.write( JSON.stringify( obj ) + '\n' );
    });

    socket.on( 'GAME JOIN', function(data) {
        var obj = createMessage( 'GAME JOIN', {
            clientId: socket.id,
            gameId: data.id
        });
        client.write( JSON.stringify( obj ) + '\n' );
    });

    socket.on( 'GAME UPDATE SUBSCRIBE', function(data) {
        var obj = createMessage( 'GAME UPDATE SUBSCRIBE', {
            gameId: data.id
        });
        client.write( JSON.stringify( obj ) + '\n' );
    });

    socket.on( 'GAME DELETE', function(data) {
        var obj = createMessage( 'GAME DELETE', {
            clientId: socket.id,
            gameId: data.id
        });
        client.write( JSON.stringify( obj ) + '\n' );
    });

    socket.on( 'GAME START', function(data) {
        var obj = createMessage( 'GAME START', {
            clientId: socket.id,
            gameId: data.id
        });
        client.write( JSON.stringify( obj ) + '\n' );
    });

    socket.on( 'GAME LEAVE', function(data) {
        var obj = createMessage( 'GAME LEAVE', {
            clientId: socket.id,
            gameId: data.id
        });
        client.write( JSON.stringify( obj ) + '\n' );
    });

    socket.on( 'GAME SET', function(data) {
        var obj = createMessage( 'GAME SET', {
            clientId: socket.id,
            gameId: data.id,
            cards: data.set
        });
        client.write( JSON.stringify( obj ) + '\n' );
    });

    socket.on( 'GAME FEED', function(data) {
        var obj = createMessage( 'GAME FEED MESSAGE', {
            gameId: data.id,
            username: data.user,
            msgType: data.type,
            data: data.message
        });
        client.write( JSON.stringify( obj ) + '\n' );
    });

});
