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
        socket.on( 'USER REGISTER ACK', function( data ) {
            callback( data );
        });
    };

    return Socket;
});
