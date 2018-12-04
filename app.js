const http = require('http');
const https = require('https');
const url = require('url'); 
var request = require('request');


const url_Base_MGR = 'https://leashtime.com';
const mmdLogin = 'mmd-login.php';
const mmdSitters = 'mmd-sitters.php';
const mmdClients = 'mmd-clients.php';
const mmdVisits = 'mmd-visits.php';
const mmdEnvironment = 'mmd-environment.php';

var currentUser = '';
var currentPass= '';

const port = 3300;
const maxLength = 10;


var visitList =[];
var sitterList = [];
var clientList = [];
var timeOffList = [];


const visitData = require('./data/visit.json');
const clientData = require('./data/client.json');
var clientProfile = [];
var timeFrames = [];
var serviceTypes = [];
var surchargeTypes = [];
var clientOwnVisits = [];

// https://leashtime.com/client-own-scheduler-data.php?timeframes=1


http.createServer((req, res) => {
	var typeRequest = url.parse(req.url,true).query;
	var theType = typeRequest.type;

	res.writeHead(200, { 'Content-Type': 'application/json','Access-Control-Allow-Origin':'*'});
 	
 	if (theType == "gSit") {
		console.log('Num sitters: ' + sitterList.length);
		res.write(JSON.stringify(sitterList));
		res.end();
	} else if (theType == "gVisit") {

		res.write(JSON.stringify(visitList));
		res.end();
	} else if (theType == "gClients") {

		res.write(JSON.stringify(clientList));
		res.end();
	} else if(theType == 'mmdLogin') {

		mgrLoginURL = url_Base_MGR +'/'+ mmdLogin;

		let username;
		let password;

		if (currentUser == '') {
			username= typeRequest.username;
		} else {
			username = currentUser;
		}
		if (currentPass == '') {
			password = typeRequest.password;
		} else {
			password = currentPass;
		}
		console.log('Username: ' + username + ' Password: ' + password);
		currentUser = username;
		currentPass = password;

		let user_role = typeRequest.role;
		let start_date = typeRequest.startDate;
		let end_date = typeRequest.endDate;
		console.log(start_date + ' - ' + end_date);
		visitList =[];
		sitterList = [];
		clientList = [];
		timeOffList = [];
	 	var j = request.jar();
	 	request = request.defaults({jar: j});
	 	// login request
	 	request.post({
	 			url: 'https://leashtime.com/mmd-login.php', 
	 			form: {user_name:username, user_pass:password, expected_role:user_role},
	 			headers: {
					'Content-Type' : 'application/x-www-form-urlencoded',
					'User-Agent' : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.1.2 Safari/605.1.15'
				}

	 	}, function(err,httpResponse,body){ 
	 		if(err != null) {
	 			console.log(err);
	 		} else {

	 			let cookieVal = httpResponse.headers['set-cookie'];
	 			// get sitters request
	 			request.post({
	 				url: 'https://leashtime.com/mmd-sitters.php',
	 				headers: {
	 					'Cookie' : cookieVal,
						'Content-Type' : 'application/x-www-form-urlencoded',
						'User-Agent' : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.1.2 Safari/605.1.15'
	 				}
	 			}, function(err2, httpResponse2, body2) {
	 				if (err2 != null) {
	 					console.log(err2);
	 				} else {
	 					let listSitterID;
	 					sitterJSON = JSON.parse(body2);
	 					sitterList = sitterJSON.sitters;
						console.log('----------------------------------------------------');
	 					console.log('Sitter List: ' + sitterList.length);
			 			console.log('----------------------------------------------------');

			 			sitterList.forEach((sitter) => {
			 				listSitterID += sitter.id + ',';
			 			});
			 			// visit request
						request.post({
							url: 'https://leashtime.com/mmd-visits.php',
							form: {'start' : start_date, 'end': end_date, 'sitterids':listSitterID},
							headers: {
								'Cookie': cookieVal,
								'Content-Type' : 'application/x-www-form-urlencoded',
								'User-Agent' : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.1.2 Safari/605.1.15'
							}
						}, function(err3,  httpResponse3, body3) {
							if (err3 != null) {
								console.log(err3);
							} else {
								listSitterID = ''
								visitList = JSON.parse(body3);
								console.log('NUM VISIT: ' + visitList.length);
								visitList.forEach((visit)=>{
									console.log('Client: ' + visit.clientname + ', visit id: ' + visit.appointmentid);
								})
								let clientIDlist;
								visitList.forEach((visitItem)=> {
									console.log(visitItem.clientptr);
									clientIDlist += visitItem.clientptr + ',';

								})
							 	console.log('----------------------------------------------------');
								console.log('CALLING GET CLIENT DATA: ' + clientIDlist);
								console.log('----------------------------------------------------');
							 	// clients request
							 	request.post({
									url: 'https://leashtime.com/mmd-clients.php',
									form: {'clientids':clientIDlist},
									headers: {
										'Cookie': cookieVal,
										'Content-Type' : 'application/x-www-form-urlencoded',
										'User-Agent' : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.1.2 Safari/605.1.15'
									}
								}, function(err4,  httpResponse4, body4) {
									if (err4 != null) {
										console.log(err4);
									} else {
										console.log('----------------------------------------------------');
										console.log('Recevied client data response');
										let allClientInfo = JSON.parse(body4);	
										clientList = allClientInfo.clients;
										console.log('Client list num items: ' + clientList.length);
								 		console.log('----------------------------------------------------');
								 		res.write(JSON.stringify({managerData : "ok"}));
								 		res.end();
									}
								});
							 }
						})
					}
				});
	 		}
	 	});
	} else if (theType == "cancel") {

		res.write(JSON.stringify({ "response" : "ok"}));
		visitCancel(typeRequest.visitid, typeRequest.note);
		res.end();
	} else if(theType == "uncancel") {

		res.write(JSON.stringify({ "response" : "ok"}));
		visitUncancel(typeRequest.visitid, typeRequest.note);
		res.end();
	} else if(theType == "change") {

		res.write(JSON.stringify({ "response" : "ok"}));
		visitChange(typeRequest.visitid, typeRequest.note);
		res.end();
	} else if (theType == "poVisits") {

		res.write(JSON.stringify(visitData));
		res.end();
	} else if (theType == "poClients") {

		res.write(JSON.stringify(clientData));
		res.end();
	} else if(theType == "petOwnerVisits") {
		var clientRequest = require('request-promise');
		var clientGetRequest = require('request-promise');
		let clientOwnVisitURL = 'https://client-own-scheduler-data.php?timeframes=1';	
		var clientJar = clientRequest.jar();
		clientRequest = clientRequest.defaults({jar: clientJar});
		//let username = typeRequest.username;
		//let password = typeRequest.password;
		let username = 'theodore';
		let password = 'dlifPOP1';
		let user_agent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.1.2 Safari/605.1.15';
		let start_date = '2018-11-01';
		let end_date = '2018-12-31';

		clientRequest.post({
			url : 'https://leashtime.com/login.php',
			form: {user_name:username, user_pass:password, bizid : '', expected_role : 'c', juseragent : user_agent, redirect : '/login'},
	 		headers: {
				'Content-Type' : 'application/x-www-form-urlencoded',
				'User-Agent' : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.1.2 Safari/605.1.15'
			}
		}, function(err, httpResponse, body) {
			if(err != null) {
	 			console.log(err);
	 			res.end();
	 		} else {
	 			let cookieVal = httpResponse.headers['set-cookie'];
	 			console.log('-----------------------------------');
	 			console.log('RESPONSE COOKIE');
	 			console.log('CLIENT --> Cookie value: ' + cookieVal);

	 			console.log('-----------------------------------');
	 			console.log('-------HEADER RESPONSE-------------------');
	 			console.log(httpResponse.headers);
	 			console.log('-----------------------------------');
	 			console.log('BODY');
	 			console.log('-----------------------------------');
	 			//console.log(body);

	 			let options = {
	 				method : 'GET',
	 				uri : 'https://leashtime.com/client-own-scheduler-data.php',
	 				json : true,
	 				qs : { 
	 						start : start_date,
	 						end : end_date
	 				},
	 				headers : {
	 					'User-Agent' : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.1.2 Safari/605.1.15',
	 					'Cookie' : cookieVal,
	 					'Upgrade-Insecure-Requests' : 1,
	 					'Host': 'leashtime.com',
	 					'Content-Type':     'application/x-www-form-urlencoded'
	 				}
	 			}


				var clientJar2 = clientGetRequest.jar();
	 			clientGetRequest =  clientGetRequest.defaults({jar: clientJar2});
	 			clientGetRequest(options, function (error, response, body) {
   					if (!error && response.statusCode == 200) {
   						console.log('-----------------------------------');
	 					console.log('-------HEADER RESPONSE-------------------');
   						console.log(response.headers);
   						console.log('-----------------------------------');

        				// Print out the response body
        				//console.log(body)
    				}
				})
	 		}
		});
	}
}).listen(port);


function cleanupSession() {

	sitterList = [];
	visitList = [];
	clientList = [];
	request =require('request');
	console.log(request.headers);
}
function getVisitData(request, start, end, cookie, sitterIDs) {
	request.post({
		url: 'https://leashtime.com/mmd-visits.php',
		form: {'start' : start, 'end': end, 'sitterids':sitterIDs},
		headers: {
			'Cookie': cookie,
			'Content-Type' : 'application/x-www-form-urlencoded',
			'User-Agent' : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.1.2 Safari/605.1.15'
	 	}
	}, function(err3,  httpResponse3, body3) {
		if (err3 != null) {
			console.log(err3);
		} else {
			listSitterID = ''
			visitList = JSON.parse(body3);
			let clientIDlist;
			visitList.forEach((visitItem)=> {
				clientIDlist += visitItem.clientptr + ',';
			})
	 		console.log('----------------------------------------------------');
			console.log('CALLING GET CLIENT DATA: ' + clientIDlist);
		 	console.log('----------------------------------------------------');

		}
	})
}
function getClientData(request, cookie, clientIDs) {
	request.post({
		url: 'https://leashtime.com/mmd-clients.php',
		form: {'clientids':clientIDs},
		headers: {
			'Cookie': cookie,
			'Content-Type' : 'application/x-www-form-urlencoded',
			'User-Agent' : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.1.2 Safari/605.1.15'
		}
	}, function(err4,  httpResponse4, body4) {
		if (err4 != null) {
			console.log(err4);
		} else {
			console.log('----------------------------------------------------');
			console.log('Recevied client data response');
			let allClientInfo = JSON.parse(body4);	
			clientList = allClientInfo.clients;
			console.log('Client list num items: ' + clientList.length);
	 		console.log('----------------------------------------------------');

		}
	})
}
function getSitterList() {

	return JSON.stringify(sitterList);
}

function getFlagData() {

}
function visitCancel(appointmentid, note) {

	console.log("CANCEL VISIT REQUEST FOR: " + appointmentid);
}
function visitUncancel(appointmentid, note) {

	console.log("UNCANCEL VISIT REQUEST FOR: " + appointmentid);
}
function visitChange(appointmentid, note) {
	
	console.log("VISIT CHANGE FOR " + appointmentid);
}
function requestVisits(visitInfoArray) {

	visitInfoArray.forEach((visitDict)=> {

			let date = visitDict.date;
			let timeWindow = visitDict.timewindow;
			let serviceID = visitDict.serviceid;
			let pets = visitDict.pets;
			let note = visitDict.note;
			let isStart = visitDict.isstart;
			let isEnd = visitDict.isend;
			let visitCharge = visitDict.visitcharge;


	})
}

	/*} /*else if(theType == "managerVisits") {
		let userName = 'dlife'; //typeRequest.username;
		let password = 'pass'; //typeRequest.password;
		let dateBegin = '2018-11-01'; //typeRequest.startdate;
		let dateEnd = '2018-11-04'; //typeRequest.enddate;

		let promiseArray = [];
		let parsedData = '';

		password = 'QVX992DISABLED';

		sitter_login.forEach((sitter)=> {
			let url_base = 'https://leashtime.com/native-prov-multiday-list.php?loginid='+sitter+'&password='+password+'&start='+dateBegin+'&end='+dateEnd;

			let sitterVisitsPromise = new Promise((resolve,reject)=>{
				let rawData = '';
				https.get(url_base, (res) => {
					res.on('data',(chunk)=> {
						rawData += chunk;
					});
					res.on('end',()=> {
						let parsedData = JSON.parse(rawData);
						resolve(parsedData);
					});
				}).on("error", (err) => {
						reject(err);
				});
			})
			promiseArray.push(sitterVisitsPromise);
		});

		var allRequests = Promise.all(promiseArray);
		allRequests.then((data) => {

			let returnStream = [];
			clientProfile = [];

			data.forEach(function(visitInfo) {

				let visitData = visitInfo.visits;
				let clientProfileData = visitInfo.clients;
				let flagData = visitInfo.flags;

				visitData.forEach(function(visitDetails) {
					returnStream.push(visitDetails);
				});

				let cProfKeys = Object.keys(clientProfileData);
				cProfKeys.forEach((key)=> {
					clientProfile.push(clientProfileData[key]);
				});
			});

			let streamJson = JSON.stringify(returnStream);
			res.write(JSON.stringify(streamJson));
			res.end();
		})
		.catch((error) => {
			console.log("Error executing all promises: " + error);
		});*/


