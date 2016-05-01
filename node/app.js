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
    var msgObj = JSON.parse(msg);
    console.log( 'Processed message ' + msgObj.msgId + ': ' + msgObj.msgType );
    console.log( msgObj.data );

    var data = msgObj.data;
    switch( msgObj.msgType ) {
        case 'USER LOGIN SUCCESS':
            connectedClients[data.clientId].emit( 'USER LOGIN ACK', true );
            break;
        case 'USER LOGIN FAIL':
            connectedClients[data.clientId].emit( 'USER LOGIN ACK', false );
            break;
        case 'USER LOGOUT SUCCESS':
            connectedClients[data.clientId].emit( 'USER LOGOUT ACK', true );
            break;
        case 'USER LOGOUT FAIL':
            connectedClients[data.clientId].emit( 'USER LOGOUT ACK', false );
            break;
        case 'LOBBY LIST SUCCESS':
            for ( var i = 0; i < data.clients.length; ++i) {
                connectedClients[data.clients[i]].emit( 'LOBBY UPDATE', data.games );
            }
            break;;
        case 'GAME CREATE SUCCESS':
            var obj = createMessage( 'LOBBY LIST', {} );
            client.write( JSON.stringify( obj ) + '\n' );
            break;
        default:
            break;
    }
});

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

        socket.emit( 'GAME CREATE ACK', true );

        socket.on( 'GAME CREATE SUCCESS', function ( data ) {
            var obj = createMessage( 'LOBBY LIST', {} );
            socket.emit( JSON.stingify( obj ) + '\n' );
        });
    });

    socket.on( 'GAME JOIN', function(data) {
        var obj = createMessage( 'GAME JOIN', {
            id: data.id
        });
        client.write( JSON.stringify( obj ) + '\n' );

        socket.emit( 'GAME JOIN ACK', true );
    });

    socket.on( 'GAME DELETE', function(data) {
        var obj = createMessage( 'GAME DELETE', {
            id: data.id
        });
        client.write( JSON.stringify( obj ) + '\n' );

        socket.emit( 'GAME DELETE ACK', true );
    });

    socket.on( 'GAME START', function(data) {
        var obj = createMessage( 'GAME START', {
            clientId: socket.id
        });
        client.write( JSON.stringify( obj ) + '\n' );

        var game = {
            scores: {
                jonny: 4,
                akshay: 2,
                jason: -11,
                calvin: 1
            },
            cards: [ '0011', '1011', '2012', '0010', '1101', '1021',
                     '0022', '2222', '1010', '1001', '1111', '2000' ],
            feed: [
                { type: 'join', user: 'jonny' },
                { type: 'join', user: 'jason' },
                { type: 'join', user: 'calvin' },
                { type: 'chat', user: 'jonny', message: 'greetings' },
                { type: 'join', user: 'akshay' },
                { type: 'chat', user: 'akshay', message: 'hi' },
                { type: 'start' },
                { type: 'set', user: 'jonny' },
                { type: 'set', user: 'jonny' },
                { type: 'set', user: 'calvin' },
                { type: 'fail', user: 'jason' },
                { type: 'set', user: 'calvin' },
                { type: 'end' }
            ]
        };

        socket.emit( 'GAME START ACK', game );
    });

    socket.on( 'GAME LEAVE', function(data) {
        var obj = createMessage( 'GAME LEAVE', {
            clientId: socket.id
        });
        client.write( JSON.stringify( obj ) + '\n' );

        socket.emit( 'GAME LEAVE ACK', true );
    });

    socket.on( 'GAME SET', function(data) {
        var obj = createMessage( 'GAME SET', {
            clientId: socket.id,
            set: data.set
        });
        client.write( JSON.stringify( obj ) + '\n' );

        socket.emit( 'GAME SET ACK', true );
    });

});
