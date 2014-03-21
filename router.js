/*!
    GPII @@pilotsConfig

    Copyright 2014 Technische Universität Dresden (TUD)
    Copyright 2014 Raising the Floor - International (RtF)

    Licensed under the New BSD license. You may not use this file except in
    compliance with this License.

    You may obtain a copy of the License at
    https://github.com/GPII/universal/blob/master/LICENSE.txt


    Acknowledgements:
    The research leading to these results has received funding from 
    the European Union's Seventh Framework Programme (FP7/2007-2013) 
    under grant agreement no. 289016.
*/

function route(handle, pathname, response, postData) {
	console.log("About to route a request for " + pathname);
	
	if(typeof handle[pathname] === 'function') {
		
		handle[pathname](response, postData);
	
	} else {
	
	console.log("No request handler found for " + pathname);
	response.writeHead(404, {"Content-Type": "text/plain"});
	response.write("404 Not found");
	response.end();

	}
}

exports.route = route;