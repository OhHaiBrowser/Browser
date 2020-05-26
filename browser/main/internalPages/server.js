const {protocol} = require('electron');
const fs = require('fs');
const url = require('url');

const SCHEMENAME = 'ohhai';

module.exports.registerScheme = () => {
	protocol.registerSchemesAsPrivileged([{scheme: SCHEMENAME, privileges: {secure: true, standard: true}}]);
};

module.exports.initInternalPages = () => {
	protocol.registerStreamProtocol('ohhai', (req, cb) => {
		const uri = url.parse(req.url);
		console.log(uri);
        
		switch(uri.host) {
		case 'settings':
			cb(pathControler(req, uri));
			break;
		case 'about':
			cb(pathControler(req, uri));
			break;
		case 'error':
			cb(pathControler(req, uri));
			break;
		case 'home':
			cb(pathControler(req, uri));
			break;
		default :
			cb({statusCode: 404});
		}
	});
};

function pathControler(req, uri) {
	if(uri.path === '/') {
		return fs.createReadStream(`${__dirname}/${uri.host}/index.html`);
	} else {
		return fs.createReadStream(`${__dirname}/${uri.host}${uri.path}`);
	}
}
