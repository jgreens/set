define(
[
    'socket.io'
]
, function(
    io
) {
    var socket = io();

    var Socket = {};

    Socket.register = function( state, callback ) {
        socket.emit( 'USER REGISTER', state );
        socket.once( 'USER REGISTER ACK', function( data ) {
            callback( data );
        });
    };

    Socket.login = function( state, callback ) {
        socket.emit( 'USER LOGIN', state );
        socket.once( 'USER LOGIN ACK', function( data ) {
            callback( data );
        });
    };

    Socket.startLobby = function( callback ) {
        socket.emit( 'LOBBY LIST' );
        socket.once( 'LOBBY LIST ACK', function( data ) {
            callback( data );
        });
        socket.on( 'LOBBY UPDATE', function( data ) {
            callback( data );
        });
    }

    Socket.endLobby = function() {
        socket.removeListener( 'LOBBY UPDATE' );
        socket.emit( 'LOBBY LIST END' );
    }

    Socket.createGame = function( state, callback ) {
        socket.emit( 'GAME CREATE', state );
        socket.once( 'GAME CREATE ACK', function( data ) {
            callback( data );
        });
    };

    return Socket;
});
