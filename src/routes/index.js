const express = require( "express" );
const router = express.Router();

const crypto = require( 'crypto' );

const scripts = require( "../lib/scripts" );

function get( req, res, next )
{
	res.format(
		{
			json: () =>
			{
				res.json( Array.from( scripts.keys() ) )
			},
			html: () =>
			{
				res.render( "index", { scripts: scripts.keys() } );
			}
		} );
}

function post( req, res, next )
{
	const id = crypto.randomBytes( 4 ).toString( 'hex' );

	scripts.set( id, req.body.script );

	res.redirect( `/${id}` );
}

router.get( "/", get );
router.post( "/", post );

module.exports = router;