var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandler");

var handle = {}
handle["/"] = requestHandlers.start;
handle["/start"] = requestHandlers.start;
handle["/setDeviceinfo"] = requestHandlers.setDeviceinfo;
handle["/selectMM"] = requestHandlers.selectMM;
handle["/snapshotToPrefs"] = requestHandlers.snapshotToPrefs;
handle["/getFeedback"] = requestHandlers.getFeedback;


// injecting the route function of router module into server module:
server.start(router.route, handle);

