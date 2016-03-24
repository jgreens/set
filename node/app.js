var app = require( 'express' )();
var http = require( 'http' ).Server( app );
var io = require( 'socket.io' )( http );
var unixSocket = require( 'unix-socket' );
var ROOT = '/home/cooper/set';

app.get( '/', function( req, res ){
    res.sendfile( ROOT + '/public_html/index.html' );
});

http.listen( 3000, function(){
    console.log( 'listening on *:3000' );
});

io.on( 'connection', function( socket ) {
    console.log( 'a user connected' );
    socket.on( 'SET', function( msg ) {
        io.emit( 'SET', msg );
        var dt = msg - new Date().getTime();
        console.log( 'SET:' +  + ' ' + dt.toString() );
    });
});

var option = { 
    path: ROOT + '/server.sock',
    mode: 0666 
};

/*
unixSocket.listen( server, option, function( result ) {
    if( result ) {
        console.log( 'Server started on ' + result );
    } else {
        console.error( 'Error' );
        process.exit( 0 );
    }
});
*/
