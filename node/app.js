var app = require( 'express' )();
var http = require( 'http' ).Server( app );
var io = require( 'socket.io' )( http );
var unixSocket = require( 'unix-socket' );
var net = require('net');


//var ROOT = '/home/cooper/set';
var ROOT = '/home/jason/school/ece361/set';


app.get( '/', function( req, res ){
    res.sendFile( ROOT + '/public_html/index.html' );
});

// Utility function to create messages with id numbers (used for acks)
var msgCount = 0;
var createMessage = function( msgType, data ) {
    var obj = {
        msgId: msgCount++,
        msgType: msgType,
        data: data
    }
    console.log( 'Sending message: ' );
    console.log( obj );
    return obj;
};

// Node-Java socket connection event handling
const client = net.connect( 1010, 'localhost' );
client.on( 'connect', function() {
    // 'connect' listener
    var obj = createMessage( "nodeConnect", { msg: "connected to server!" } );
    client.write( JSON.stringify( obj ) + '\n' );
});
client.on( 'data', function( msg ) {
    var msgObj = JSON.parse(msg.toString());
    console.log( 'Processed message ' + msgObj.msgId + ': ' + msgObj.msgType + (msgObj.msgType == "ack" ? (' for message ' + msgObj.data.ackNum) : '') );
});
client.on( 'end', function() {
    console.log( 'disconnected from server' );
});

http.listen( 3000, function(){
    console.log( 'listening on *:3000' );
});

// Node-Browser socket connection event handling
io.on( 'connection', function( socket ) {
    var obj = createMessage( "registerClient", { userId: "testId" } );
    client.write( JSON.stringify( obj ) + '\n' );

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
        var obj = createMessage( "unregisterClient", { userId: "testId" } );
        client.write( JSON.stringify( obj ) + '\n' );
    });
});
