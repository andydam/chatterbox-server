//import chatter functions and methods
var chatter = require('./chatter');
var fs = require('fs');

//preload web server files
var clientFiles = {
  '/index.html': {
    file: fs.readFileSync(__dirname + '/../client/index.html'),
    type: 'text/html'
  },
  '/': {
    file: fs.readFileSync(__dirname + '/../client/index.html'),
    type: 'text/html'
  },
  '/styles/styles.css': {
    file: fs.readFileSync(__dirname + '/../client/styles/styles.css'),
    type: 'text/css'
  },
  '/scripts/app.js': {
    file: fs.readFileSync(__dirname + '/../client/scripts/app.js'),
    type: 'text/javascript'
  },
  '/images/spiffygif_46x46.gif': {
    file: fs.readFileSync(__dirname + '/../client/images/spiffygif_46x46.gif'),
    type: 'image/gif'
  }
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

var getMessages = (request, response) => {
  //client is requesting a GET of messages
  var statusCode = 200;
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = 'application/json';
  response.writeHead(statusCode, headers);
  //return JSON stringified object containing a results array with all message objects
  response.end(chatter.returnMessages());
};

var postMessage = (request, response) => {
  //client is requesting a POST to send a message
  //declare string to store data
  let requestData = '';
  //event handler for when data is being recieved
  request.on('data', data => {
    //take the chunk of data and concat it to the rest of the data
    requestData += data;
  });
  //event handler for when data is all recieved
  request.on('end', () => {
    //response to POST request
    var statusCode = 201;
    var headers = defaultCorsHeaders;
    headers['Content-Type'] = 'application/json';
    response.writeHead(statusCode, headers);
    //parse and store message, return response object
    response.end(chatter.storeMessage(JSON.parse(requestData)));
  });
};

var requestHandler = function(request, response) {
  console.log('Serving request type ' + request.method + ' for url ' + request.url);
  if (request.url.startsWith('/classes/messages') && request.method === 'GET') {
    //client is requesting a GET of messages
    getMessages(request, response);
  } else if (request.url.startsWith('/classes/messages') && request.method === 'POST') {
    //client is requesting a POST to send a message
    postMessage(request, response);
  } else if (request.method === 'OPTIONS') {  
    //client is doing initial options request
    //respond back to client with our headers
    response.writeHead(204, defaultCorsHeaders);
    response.end();
  } else if (clientFiles.hasOwnProperty(request.url.split('?')[0])) {
    //client is requesting one of the chatterbox web client files
    //pull file path from request url
    let filePath = request.url.split('?')[0];
    var statusCode = 200;
    var headers = defaultCorsHeaders;
    //return content type of desired file
    headers['Content-Type'] = clientFiles[filePath].type;
    response.writeHead(statusCode, headers);
    //return desired file in body of response
    response.end(clientFiles[filePath].file);
  } else {
    //response to unknown request
    var statusCode = 404;
    var headers = defaultCorsHeaders;
    headers['Content-Type'] = 'application/json';
    response.writeHead(statusCode, headers);
    response.end();
  }
};

//export requestHandler for use outside of module
exports.requestHandler = requestHandler;