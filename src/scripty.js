const express = require( "express" );
const createError = require( "http-errors" );
const path = require( "path" );

const index = require( "./routes/index" );
const script = require( "./routes/script" );


const app = express();

app.set( "views", path.join( __dirname, "views" ) );
app.set( "view engine", "hbs" );

app.use( express.json() );
app.use( express.urlencoded( { extended: false } ) );

app.use( "/static/", express.static( path.join( __dirname, "static" ) ) );


app.use( "/", index );
app.use( "/", script );


app.use( function( req, res, next )
{
	next( createError( 404 ) );
} );

app.use( function( err, req, res, next )
{
	if( !( err instanceof createError.HttpError ) )
	{
		console.error( err.message );
		console.error( err.stack );

		var err = createError( 500 );
	}

	const error =
	{
		status: err.status,
		message: err.message
	};

	res.status( err.status );

	res.format(
		{
			json: () =>
			{
				res.json( error )
			},
			html: () =>
			{
				res.render( "error", error );
			}
		} );

} );

module.exports = app;
