define(
[
    'socket-io'
]
, function(
    socket
) {
    var Socket = {}; 

    Socket.register = function( state ) {
        socket.emit( 'USER REGISTER', state );
        console.log( state );
        console.log( socket );
    };

    return Socket;
});
