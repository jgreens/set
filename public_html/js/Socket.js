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

    return Socket;
});
