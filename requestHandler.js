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
var util = require('util');
var http = require('http');
var querystring = require("querystring");
var fs = require('fs');

function start(response, postData){
	console.log("Request handler 'start' was called");
	//TODO: load html from template (split logic from content)
	var body = '<html>'+
	 '<head>'+
	 '<meta http-equiv="Content-Type" content="text/html; '+
	 'charset=UTF-8" />'+
	 '</head>'+
	 '<body>'+
	 '<h1>Pilots Configuration Panel </h1>'+
	 '<h2>Select Matchmaker</h2>'+
	 '<p>Note: Cloud4all/GPII server must be started to select a Matchmaker<br></p>'+
	 '<form action="/selectMM" method="post">'+
	 '<p>For auto-configuration scenario:<br>'+
	 '<input type="radio" name="matchmaker" checked="checked" value="default">Rule-based Matchmaker (without solution selection option)<br>'+
	 '<input type="radio" name="matchmaker" value="statistical">Statistical Matchmaker<br>'+
	 '</p>'+
// 	Remove logging from pilotsConfig
//	'<p>For demo solution selection scenario:<br>'+
//	'<input type="radio" name="matchmaker" value="ruleBased">Rule-based Matchmaker<br>'+
//	'</p>'+
	 '<input type="submit" value="Set Matchmaker strategy" />'+
	 '</form></p>'+
	 '<h2>Snapshot prefs</h2>'+
	 '<form action="/snapshotToPrefs" method="post">'+
	 '<input type="submit" value="Snapshot" />'+
	 '</form></p>	'+
	 //'<h2>Log prefs</h2>'+
	 //'<form action="/snapshotToLog" method="post">'+
	 //'<input type="submit" value="Log Prefs" />'+
	 //'</form></p>	'+	 
	 '<h2>Select Device Specification</h2>'+
	 '<form action="/setDeviceinfo" method="post">'+
	 '<p>For platform A/B scenario:<br>'+
	 '<input type="radio" name="device" value="platformAB_onWindows_NVDA">Windows (NVDA and Windows Magnifier) or Linux <br>'+
	 '<input type="radio" name="device" value="platformAB_onWindows_Supernova">Windows (SuperNova screen reader and magnifier) or Linux <br><br>'+
	// '<input type="radio" name="device" value="platformAB_onAndroid_TalkBack">Android (TalkBack)<br>'+
	// '<input type="radio" name="device" value="platformAB_onAndroid_MobileAccessibility">Android (TalkBack)<br>'+
	 '</p>'+
	 '<p>For Demos:<br>'+
	 '<input type="radio" name="device" value="demo_SmartHouse">SmartHouse<br>'+
	 '<input type="radio" name="device" value="demo_Maavis">Maavis<br>'+
	 '<input type="radio" name="device" value="demo_GoogleChrome">Google Chrome<br><br>'+
//	 '<input type="radio" name="device" value="demo_Library">Library<br>'+
//	 '<input type="radio" name="device" value="demo_MultipleSolutions">Mulitple solutions in computer lab<br>'+
	 '</p>'+
//	 '<p>Reset device specification to default:<br>'+
//'<input type="radio" name="device" value="installedSolutions">Default<br>'+
//	 '</p>'+
	 '<input type="submit" value="Set device configuration" />'+
	 '</form>'+
	 '<h2>Proposing a new Solution - Feedback</h2>'+
	 '<p>NVDA:<br>'+
	 '<a href="http://wwwpub.zih.tu-dresden.de/~loitsch/feedback/NVDA/RBMMFeedbackGerman.html" target="_blank">NVDA feedback German</a><br>'+
	 '<a href="http://wwwpub.zih.tu-dresden.de/~loitsch/feedback/NVDA/RBMMFeedbackSpanish.html" target="_blank">NVDA feedback Spain</a><br>'+
	 '<a href="http://wwwpub.zih.tu-dresden.de/~loitsch/feedback/NVDA/RBMMFeedbackGreek.html" target="_blank">NVDA feedback Greek</a><br>'+	 
	 '<a href="http://wwwpub.zih.tu-dresden.de/~loitsch/feedback/NVDA/RBMMFeedbackEnglish.html" target="_blank">NVDA feedback Englisch</a><br>'+
	 '</p>'+
	 '<p>SuperNova:<br>'+
	 '<a href="http://wwwpub.zih.tu-dresden.de/~loitsch/feedback/SuperNova/RBMMFeedbackGerman.html" target="_blank">SuperNova feedback German</a><br>'+
	 '<a href="http://wwwpub.zih.tu-dresden.de/~loitsch/feedback/SuperNova/RBMMFeedbackSpanish.html" target="_blank">SuperNova feedback Spain</a><br>'+
	 '<a href="http://wwwpub.zih.tu-dresden.de/~loitsch/feedback/SuperNova/RBMMFeedbackGreek.html" target="_blank">SuperNova feedback Greek</a><br>'+	 
	 '<a href="http://wwwpub.zih.tu-dresden.de/~loitsch/feedback/SuperNova/RBMMFeedbackEnglish.html" target="_blank">SuperNova feedback Englisch</a><br'+
	 '</p>'+
	 '<p>WebAnywhere:<br>'+
	 '<a href="http://wwwpub.zih.tu-dresden.de/~loitsch/feedback/WebAnywhere/RBMMFeedbackGerman.html" target="_blank">WebAnywhere feedback German</a><br>'+
	 '<a href="http://wwwpub.zih.tu-dresden.de/~loitsch/feedback/WebAnywhere/RBMMFeedbackSpanish.html" target="_blank">WebAnywhere feedback Spain</a><br>'+
	 '<a href="http://wwwpub.zih.tu-dresden.de/~loitsch/feedback/WebAnywhere/RBMMFeedbackGreek.html" target="_blank">WebAnywhere feedback Greek</a><br>'+	 
	 '<a href="http://wwwpub.zih.tu-dresden.de/~loitsch/feedback/WebAnywhere/RBMMFeedbackEnglish.html" target="_blank">WebAnywhere feedback Englisch</a><br'+	 
	 '</p>'+
	 '<p>ORCA:<br>'+
	 '<a href="http://wwwpub.zih.tu-dresden.de/~loitsch/feedback/ORCA/RBMMFeedbackGerman.html" target="_blank">ORCA feedback German</a><br>'+
	 '<a href="http://wwwpub.zih.tu-dresden.de/~loitsch/feedback/ORCA/RBMMFeedbackSpanish.html" target="_blank">ORCA feedback Spain</a><br>'+
	 '<a href="http://wwwpub.zih.tu-dresden.de/~loitsch/feedback/ORCA/RBMMFeedbackGreek.html" target="_blank">ORCA feedback Greek</a><br>'+	 
	 '<a href="http://wwwpub.zih.tu-dresden.de/~loitsch/feedback/ORCA/RBMMFeedbackEnglish.html" target="_blank">ORCA feedback Englisch</a><br'+	 	 
	 '</p>'+	 
	 '</body>'+
	 '</html>';
	response.writeHead(200, {"Content-Type": "text/html"});
	response.write(body);
	response.end();
}

function setDeviceinfo(response, postData){
	var device = querystring.parse(postData)["device"];
	var filePath = 	'../node_modules/universal/testData/deviceReporter/secondPilots/'+ device +'.json' ;
	fs.createReadStream(filePath).pipe(fs.createWriteStream('../node_modules/universal/testData/deviceReporter/installedSolutions.json'));

	response.writeHead(200, {"Content-Type": "text/html"});
	response.write("Device information successfully set!");
	response.end();
}

function getJSONRequest (url, callback) {
	var	reply = "";

	// fetch preference set from the preference server
	http.get(url, function(res) {

		res.on('data', function(dat){
			reply += dat;
		});

		res.on('end', function () {

			callback(reply);
		});

	}).on('error', function(e) {
		console.log("Error on get request to "+url+": " + e.message);
		callback(undefined);
	});
};

function getCurrentToken (callback) {
	return getJSONRequest("http://localhost:8081/token", callback);
}

function getPreferences (token, callback) {
	return getJSONRequest("http://preferences.gpii.net/user/" + token, callback);
}

function getSnapshot (callback) {
	return getJSONRequest("http://localhost:8081/snapshot", callback);
}

function selectMM (response, postData) {
	var matchmaker = querystring.parse(postData)["matchmaker"];

	getCurrentToken(function (token) {
		if (token) {
				token = token.replace(/\s/, "");
				token = token.replace(/\[\"/, "");
				token = token.replace(/\"\]/, "");

			getPreferences(token, function (reply) {
				var preferences = JSON.parse(reply);
				if (preferences && preferences['preferences']) {
					preferences['preferences']['http://registry.gpii.org/common/matchMakerType'] = [{ "value": matchmaker}];
					saveModifiedPreferences(token, preferences['preferences'], "matchmaker successfully selected", response);
				} else {
					response.writeHead(200, {"Content-Type": "text/html"});
					response.write("Error on fetching preferences");
					response.end();
				}
			});

		} else {
			response.writeHead(200, {"Content-Type": "text/html"});
			response.write("Error on fetching user token");
			response.end();
		}
	});
};

function snapshotToLog(response) {
	var data = new Date();
	var timestamp = data.getDate()+'.'+data.getMonth()+'_time_'+data.getHours()+'.'+data.getMinutes();
	var path = './logs/';
	var log = { };
	//read the token of the currently logged in user
	getCurrentToken(function (token) {
		if (token) {
		
			getSnapshot(function (reply) {
				var snapshotted = JSON.parse(reply);
				log['token'] = token; 
				log['timestamp'] = timestamp; 
				log['preferences'] = snapshotted;
				fs.mkdir(path,function(e){
					if(!e || (e && e.code === 'EEXIST')){
						fs.writeFile('./logs/'+token+'_'+timestamp, JSON.stringify(log), function(err) {
					
							if(err) {
								console.log(err);
								response.end();
							} else {
								console.log("Logfile saved!");
								response.writeHead(200, {"Content-Type": "text/html"});
								response.write("Log successfully saved in directory pilotsConfig/logs");
								response.end();
							}
						});
					} else {
						//debug
						console.log(e);
					}
				});
			});

		} else {
			response.writeHead(200, {"Content-Type": "text/html"});
			response.write("Error on fetching user token");
			response.end();
		}
	});
};

function snapshotToPrefs(response) {
	//read the token of the currently logged in user
	getCurrentToken(function (token) {
		if (token) {
			token = token.replace(/\s/, "");
			token = token.replace(/\[\"/, "");
			token = token.replace(/\"\]/, "");
			//if theres a user logged in, get that users preferences
			getPreferences(token, function (reply) {
				var preferences = JSON.parse(reply);
				if (preferences && preferences['preferences']) {
					//get and add the snapshotted settings to the
					getSnapshot(function (reply) {
						var snapshotted = JSON.parse(reply);
						for (solution in snapshotted) {
							preferences['preferences'][solution] = snapshotted[solution];							
						};
						saveModifiedPreferences(token, preferences['preferences']	, "Snapshot saved to preferences server", response);
					});
				} else {
					response.writeHead(200, {"Content-Type": "text/html"});
					response.write("Error on fetching preferences");
					response.end();
				}
			});
		} else {
			response.writeHead(200, {"Content-Type": "text/html"});
			response.write("Error on fetching user token");
			response.end();
		}
	});
};


function getFeedback(response, postData){
	var file = querystring.parse(postData)['feedback'];
	fs.readFile('./feedback/'+file, function(err, feedback){
		if(err){
			throw err;
		}
		response.writeHead(200, {"Content-Type": "text/html"});
		response.write(feedback);
		response.end();
	});
}

function saveModifiedPreferences(token, preferencesObject, usrMsg, response) {
	var data = JSON.stringify(preferencesObject);

	// object of options to indicate where to POST to
	var post_options = {
		host: 'preferences.gpii.net',
		port: '80',
		path: '/user/' + token,
		method: 'POST',
		headers: {
		'Content-Type': 'application/json',
		'Content-Length': data.length
		}
	};

	// set up the http.request POST
	var post_req = http.request(post_options, function(res) {
		res.setEncoding('utf8');
		res.on('data', function (chunk) {
			console.log('Response: ' + chunk);
		});
		res.on('end', function(){
			response.writeHead(200, {"Content-Type": "text/html"});
			response.write(usrMsg);
			response.end();
		});
	});
	// writes http request body data; Server replies and response callback 'res' gets activated
	post_req.write(data);
	post_req.end();

}

exports.start = start;
exports.selectMM = selectMM;
exports.setDeviceinfo = setDeviceinfo;
exports.snapshotToPrefs = snapshotToPrefs;
exports.getFeedback = getFeedback;
exports.snapshotToLog = snapshotToLog;
