var express = require( 'express' );
var path = require( 'path' );

const socket = require('./socket');

var server = express();
server.use(express.static(path.join(__dirname, "../public_html")));
var expressServer = server.listen(3000, function() {
    console.log( 'listening on *:3000' );
});

socket.connect(expressServer);
