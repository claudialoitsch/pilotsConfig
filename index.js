/*!
    GPII pilotsConfig

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
handle["/logging"] = requestHandlers.logging;
// outdated logging
// handle["/snapshotToLog"] = requestHandlers.snapshotToLog;




// injecting the route function of router module into server module:
server.start(router.route, handle);

