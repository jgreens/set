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

    Socket.logout = function( state, callback ) {
        socket.emit( 'USER LOGOUT', state );
        socket.once( 'USER LOGOUT ACK', function( data ) {
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

    Socket.joinGame = function( state, callback ) {
        socket.emit( 'GAME JOIN', state );
        socket.once( 'GAME JOIN ACK', function( data ) {
            callback( data );
        });
    };

    Socket.createGame = function( state, callback ) {
        socket.emit( 'GAME CREATE', state );
        socket.once( 'GAME CREATE ACK', function( data ) {
            callback( data );
        });
    };

    Socket.deleteGame = function( state, callback ) {
        socket.emit( 'GAME DELETE', state );
        socket.once( 'GAME DELETE ACK', function( data ) {
            callback( data );
        });
    };

    Socket.startGame = function( state, callback ) {
        socket.emit( 'GAME START', state );
        socket.once( 'GAME START ACK', function( data ) {
            callback( data );
        });
        socket.on( 'GAME UPDATE', function( data ) {
            callback( data );
        });
    }

    Socket.submitSet = function( state, callback ) {
        socket.emit( 'GAME SET', state );
        socket.once( 'GAME SET ACK', function( data ) {
            callback( data );
        });
    };

    Socket.endGame = function( state, callback ) {
        socket.removeListener( 'GAME UPDATE' );
        socket.emit( 'GAME LEAVE', state );
        socket.once( 'GAME LEAVE ACK', function( data ) {
            callback( data );
        });
    }

    return Socket;
});
