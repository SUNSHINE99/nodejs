/*
* Hello World API application
*/

// Dependencies
var http = require('http');
var url = require('url');
// make sure you specify the directory in which config.js resides
// if you forget to add ./ before config node will not be able to
// get config.js
var config = require('./config');
var StringDecoder = require('string_decoder').StringDecoder;

// instantiating HTTP server
server = http.createServer(function(req, res){
  // Parsing url
  var parsedUrl = url.parse(req.url, true);

  // Get the path
  var path = parsedUrl.pathname;
  var trimmedPath = path.replace(/^\/+|\?+$/g,'');

  // Although this part is not required for the hello world api
  // This part get the data passed in POST request
  if(req.method == 'POST'){
    var decoder = new StringDecoder('utf-8');
    var body = '';
    req.on('data', function(data){
      body += decoder.write(data);
    });
  }
  var data = {  'trimmedPath' : trimmedPath,
                'method' : req.method,
                'headers' : req.headers,
                'payload' : body
              };
  console.log(trimmedPath);

  // If method is POST and trimmed path is hello then only execute the hello handler
  // otherwise execute the default handler(in this case it 404)
  var chosenHandler = typeof(router[trimmedPath]) != 'undefined' && req.method == "POST" && trimmedPath == 'hello' ? router[trimmedPath] : handlers.default;
  chosenHandler(data, function(statusCode, payload){
    statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
    payload = typeof(payload) == 'object' ? payload : {};

    // Convert the payload to the string
    var payloadString = JSON.stringify(payload);

    // Log the request path
    console.log('Returning this response: ', statusCode, payloadString);
    res.setHeader('Content-Type', 'application/json');
    res.writeHead(statusCode);
    res.end(JSON.stringify(payloadString));
  });

});


// Start the http server
server.listen(config.httpPort, function(){
  console.log("Server is listening on port ", config.httpPort);
});

var handlers = {};

handlers.hello = function(data, callback){
  // Here we are just sending hello message to the caller of the api in JSON
  // format
  var message = {'name' : 'Ravi',
                'msg' : 'Hello Ravi'
              };
  callback(200, message);
};

handlers.default = function(data, callback){
  // handler for all the api call except http://localhost:<port>/hello
  callback(404);
};

var router = {
  'hello' : handlers.hello
}
