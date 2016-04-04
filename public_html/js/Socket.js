define(
[
    'socket.io'
]
, function(
    io
) {
    var socket = io();

    var Socket = {};

    Socket.register = function( state ) {
        socket.emit( 'USER REGISTER', state );
        console.log( state );
        console.log( socket );
    };

    return Socket;
});
