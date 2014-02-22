var http = require("http");
var url = require("url");

function start(route, handle){
	function onRequest(request, response){
		var postData = "";
		var pathname = url.parse(request.url).pathname;
		console.log("Request for " + pathname + " received");
		
		// define the encoding of the received data
		request.setEncoding("utf8");
		// event listener for the data event; each new chunk of POST data is added to postData
		request.addListener("data", function(postDataChunk){
			postData += postDataChunk;
		});
		// event listener for 'end' event; only routes POSTS requests when all data received. 
		request.addListener("end", function(){
			route(handle, pathname, response, postData);
		});		
	}
	http.createServer(onRequest).listen(8888); 
	console.log("Server for pilot configuration pannel has started.");
	console.log("Open Browser and go to page: http://localhost:8888/start");
}

exports.start = start;
