const express = require( "express" );
const router = express.Router();

const createError = require( "http-errors" );
const markdown = require( "markdown" ).markdown;

const scripts = require( "../lib/scripts" );

function get( req, res, next )
{
	res.format(
		{
			json: () =>
			{
				res.json( req.script )
			},
			html: () =>
			{
				res.render( "script", { script: req.script } );
			}
		} );
}

function view( req, res, next )
{
	res.format(
		{
			json: () =>
			{
				res.json( markdown.toHTML( req.script ) )
			},
			html: () =>
			{
				res.render( "view", { script: markdown.toHTML( req.script ) } );
			}
		} );
}

function post( req, res, next )
{
	scripts.set( req.scriptId, req.body.script );

	res.status( 204 ).send();
}

router.param( 'id', function( req, res, next, id )
{
	if( scripts.has( id ) )
	{
		req.script = scripts.get( id );
		req.scriptId = id;
		res.locals.scriptId = id;
		next();
	}
	else
	{
		next( createError( 404 ) );
	}
} );

router.get( "/:id([0-9a-f]+)", get );
router.get( "/:id([0-9a-f]+)/view", view );
router.post( "/:id([0-9a-f]+)", post );

module.exports = router;