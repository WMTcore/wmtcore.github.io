'use strict';

let PORT = 8080;

let http = require('http');
let url = require('url');
let fs = require('fs');
let path = require('path');

const types = {
	"css": "text/css",
	"gif": "image/gif",
	"html": "text/html",
	"ico": "image/x-icon",
	"jpeg": "image/jpeg",
	"jpg": "image/jpeg",
	"js": "text/javascript",
	"json": "application/json",
	"pdf": "application/pdf",
	"png": "image/png",
	"svg": "image/svg+xml",
	"swf": "application/x-shockwave-flash",
	"tiff": "image/tiff",
	"txt": "text/plain",
	"wav": "audio/x-wav",
	"wma": "audio/x-ms-wma",
	"wmv": "video/x-ms-wmv",
	"xml": "text/xml"
};

let server = http.createServer(function(request, response) {
	let realUrl = __dirname + decodeURI(url.parse(request.url).pathname);
	let ext = path.extname(realUrl);
	if (ext) {
		ext = ext.slice(1);
	} else {
		if (realUrl.substr(realUrl.length - 1, 1) == '/') {
			realUrl += 'index.html'
		} else {
			realUrl += '/index.html'
		}
		ext = 'html';
	};
	fs.exists(realUrl, function(exists) {
		if (!exists) {
			console.error(realUrl);
			SendFile(__dirname + '/404.html', 404, 'html', response);
		} else SendFile(realUrl, 200, ext, response);
	});
});

function SendFile(dir, status, ext, response) {
	console.log(dir);
	fs.readFile(dir, "binary", (err, file) => {
		if (err) {
			response.writeHead(500, {
				'Content-Type': 'text/plain'
			});
			console.error(dir);
			return response.end(err);
		} else {
			let contentType = types[ext] || "text/plain";
			response.writeHead(status, {
				'Content-Type': contentType
			});
			response.write(file, "binary");
			return response.end();
		}
	});
}

server.listen(PORT);
console.log("Server runing at port: " + PORT + ".");