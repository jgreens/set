define(
[
    'socket-io'
]
, function(
    SocketPlaceholder // becasue socket defaults to the lowercase "socket" variable
) {
    var Socket = {}; 

    Socket.register = function( state ) {
        socket.emit( 'USER REGISTER', state );
        console.log( state );
        console.log( socket );
    };

    return Socket;
});
