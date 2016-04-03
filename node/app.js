var app = require( 'express' )();
var http = require( 'http' ).Server( app );
var io = require( 'socket.io' )( http );
var unixSocket = require( 'unix-socket' );
var net = require('net');


var ROOT = '/home/cooper/set';
//var ROOT = '/home/jason/school/ece361/set';


app.get( '/', function( req, res ){
    res.sendFile( ROOT + '/public_html/index.html' );
});

const client = net.connect( 1010, 'localhost' );
client.on( 'connect', function() {
    // 'connect' listener
    console.log( 'connected to server!' );
    var obj = {
        msgType: "nodeConnect",
        data: {
            msg: "connected to server!"
        }
    };
    client.write( JSON.stringify( obj ) + '\n' );
});
client.on( 'data', function( data ) {
    console.log( 'message received: ' + data.toString() );
});
client.on( 'end', function() {
    console.log( 'disconnected from server' );
});

http.listen( 3000, function(){
    console.log( 'listening on *:3000' );
});

io.on( 'connection', function( socket ) {
    var obj = {
        msgType: "registerClient",
        data: {
            userId: "testId"
        }
    };
    client.write( JSON.stringify( obj ) + '\n' );
    console.log( obj );
    socket.on( 'SET', function( msg ) {
        io.emit( 'SET', msg );
        var dt = msg - new Date().getTime();
        console.log( 'SET:' +  + ' ' + dt.toString() );
    });
    socket.on( 'PING_ALL', function( msg ) {
        io.emit( 'PING_ALL', msg );
        console.log( 'pinged' );
    });
    socket.on( 'disconnect', function() {
        console.log( 'a user disconnected' );
        var obj = {
            msgType: "unregisterClient",
            data: {
                userId: "testId"
            }
        };
        client.write( JSON.stringify( obj ) + '\n' );
    });
});
