var http = require('http');
var querystring = require("querystring");

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
	 '<p>For demo solution selection scenario:<br>'+
	 '<input type="radio" name="matchmaker" value="ruleBased">Rule-based Matchmaker<br>'+
	 '</p>'+
	 '<input type="submit" value="Set Matchmaker strategy" />'+
	 '</form></p>'+
	 '<h2>Snapshot prefs</h2>'+
	 '<form action="/snapshotToPrefs" method="post">'+
	 '<input type="submit" value="Snapshot" />'+
	 '</form></p>	'+
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
	 '<input type="radio" name="device" value="demo_Library">Library<br>'+
	 '<input type="radio" name="device" value="demo_MultipleSolutions">Mulitple solutions in computer lab<br>'+
	 '</p>'+
	 '<p>Reset device specification to default:<br>'+
	 '<input type="radio" name="device" value="installedSolutions">Default<br>'+
	 '</p>'+
	 '<input type="submit" value="Set device configuration" />'+
	 '</form>'+
	 '</body>'+
	 '</html>';
	response.writeHead(200, {"Content-Type": "text/html"});
	response.write(body);
	response.end();
}

function setDeviceinfo(response, postData){
	var fs = require('fs');
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
			var parsedReply = JSON.parse(reply);
			callback(parsedReply);
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

function selectMM (response, postData) {
	var matchmaker = querystring.parse(postData)["matchmaker"];

	getCurrentToken(function (token) {
		if (token) {

			getPreferences(token, function (preferences) {
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

function snapshotToPrefs(response) {
	//read the token of the currently logged in user
	getCurrentToken(function (token) {
		if (token) {
			//if theres a user logged in, get that users preferences
			getPreferences(token, function (preferences) {
				if (preferences && preferences['preferences']) {
					//get and add the snapshotted settings to the
					getJSONRequest("http://localhost:8081/snapshot", function (snapshotted) {
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