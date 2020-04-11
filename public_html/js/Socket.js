define(
[
    'socket.io'
]
, function(
    io
) {
    var socket = io({transports: ['websocket'], upgrade: false});

    var Socket = {};

    Socket.listenForError = function( callback ) {
        socket.on( 'connect_error', function( data ) {
            callback();
        });
    };

    Socket.enter = function( state, callback ) {
        socket.emit( 'USER ENTER', state );
        socket.once( 'USER ENTER ACK', function( data ) {
            callback( data );
        });
    };

    Socket.exit = function( state, callback ) {
        socket.emit( 'USER EXIT', state );
        socket.once( 'USER EXIT ACK', function( data ) {
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
    };

    Socket.endLobby = function() {
        socket.removeListener( 'LOBBY UPDATE' );
        socket.emit( 'LOBBY LIST END' );
    };

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

    Socket.startGame = function( state, callback ) {
        socket.emit( 'GAME START', state );
        socket.once( 'GAME START ACK', function( data ) {
            callback( data );
        });
    };

    Socket.gameUpdate = function( state, callback ) {
        socket.emit( 'GAME UPDATE INIT', state );
        socket.on( 'GAME UPDATE', function( data ) {
            callback( data );
        });
    };

    Socket.sendChat = function( state ) {
        socket.emit( 'GAME FEED', state );
    };

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
    };

    return Socket;
});
