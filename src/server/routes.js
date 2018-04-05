/*****************
 * RB-ICON SERVER
 *****************/
module.exports = server => {
	var app = server.app,
		path = require('path'),
		cors = require('cors');

	app.use(cors());

	/* Routes
	 *********/
	app.get('/api/superheroes', (req, res) => {
		res.json(['Superman', 'Wolverine', 'Wonder Woman']);
	});
};
