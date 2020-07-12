console.log('Hello from server.js');

var express = require('express');
var path = require('path');
var app = express();

app.use( express.static('dist') );

app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), function() {
	console.log('Server up:', app.get('port'));
});


app.get( '/', function( req, res ){
	console.log( 'Serving Home' );
	res.sendFile( path.resolve( 'index.html' ) );
});

// var myRoute = require ('../server/modules/route.js');
// app.use('/myRoute', myRoute);
