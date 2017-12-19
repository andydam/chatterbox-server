//import chatter functions and methods
var chatter = require('./chatter');

/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

// These headers will allow Cross-Origin Resource Sharing (CORS).
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

var requestHandler = function(request, response) {
  console.log('Serving request type ' + request.method + ' for url ' + request.url);
  if (request.url.startsWith('/classes/messages') && request.method === 'GET') {
    //client is requesting a GET with 
    var statusCode = 200;
    var headers = defaultCorsHeaders;
    headers['Content-Type'] = 'application/json';
    response.writeHead(statusCode, headers);
    response.end(chatter.returnMessages());
  
  } else if (request.url.startsWith('/classes/messages') && request.method === 'POST') {
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