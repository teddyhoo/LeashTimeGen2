var LTMGR = (function() {
	
	"use strict";


	var sitterList = [];
	var visitList = []; 
	var allClients = [];
	var distanceMatrix = [];
	var sitterDistanceData = [];
	var vrList = [];
	var vrListDic = {};
	var vrDetailDict = {};


	class VisitReportListItem {
		constructor(visitListItemDictionary) {
			this.visitID = visitListItemDictionary['appointmentid'];
			this.visitDate = visitListItemDictionary['visitdate'];
			this.visitTimeWindow = visitListItemDictionary['visittimeframe'];
			this.service =  visitListItemDictionary['service'];
			this.sitter =  visitListItemDictionary['sitter'];
			this.dateReport  =  visitListItemDictionary['date'];
			this.timeReport =  visitListItemDictionary['time'];
			this.url =  visitListItemDictionary['url'];
			this.externalUrl =  visitListItemDictionary['externalurl'];
		}
	};
	class VisitReport {
		constructor(visitDictionary) {
			this.BIZNAME = visitDictionary['BIZNAME'];
		    this.BIZSHORTNAME = visitDictionary['BIZSHORTNAME'];
		    this.BIZEMAIL = visitDictionary['BIZEMAIL'];
		    this.BIZHOMEPAGE = visitDictionary['BIZHOMEPAGE'];
		    this.BIZADDRESS1 = visitDictionary['BIZADDRESS1'];
		    this.BIZADDRESS2 = visitDictionary['BIZADDRESS2'];
		    this.BIZCITY = visitDictionary['BIZCITY'];
		    this.BIZSTATE = visitDictionary['BIZSTATE'];
		    this.BIZZIP = visitDictionary['BIZZIP'];
		    this.BIZLOGINPAGE = visitDictionary['BIZLOGINPAGE'];
		    this.CLIENTID = visitDictionary['CLIENTID'];
		    this.CLIENTFNAME = visitDictionary['CLIENTFNAME'];
		    this.CLIENTLNAME = visitDictionary['CLIENTLNAME'];
		    this.PETOWNER = this.CLIENTFNAME + ' ' + this.CLIENTLNAME;
		    let arriveRaw = visitDictionary['ARRIVED']; //yyyy-mm-dd hh:mm:ss
		    let completeRaw = visitDictionary['COMPLETED'];
		    let reArrComp =/[0-9]+:[0-9]+/;
		    let re=/[0-9]+-[0-9]+-[0-9]+/;
		    this.ARRIVED = reArrComp.exec(arriveRaw);
		    this.COMPLETED = reArrComp.exec(completeRaw);
		    this.vrdate =re.exec(arriveRaw);
		    this.NOTE = visitDictionary['NOTE'];
		    this.PETS = visitDictionary['PETS'];
		    this.MAPROUTEURL = visitDictionary['MAPROUTEURL'];
		    this.MAPROUTENUGGETURL = visitDictionary['MAPROUTENUGGETURL'];
		    this.VISITPHOTOURL = visitDictionary['VISITPHOTOURL'];
		    this.VISITPHOTONUGGETURL = visitDictionary['VISITPHOTONUGGETURL'];
		    this.moodButtons = visitDictionary['MOODBUTTON'];
		    this.sitterDict = visitDictionary['SITTER'];

		    if (this.sitterDict.none == true) {
		      this.SITTER = this.BIZSHORTNAME;
		    } else {
		      this.SITTER = sitterDict.sittername;
		    }

		    this.serviceLabel = 'Service';
		}
	};
	class DistanceMatrixPair {
		constructor(beginCoordinate, endCoordinate, beginName, endName, distance, duration) {
			this.beginCoordinate = beginCoordinate;
			this.endCoordinate = endCoordinate;
			this.beginName = beginName;
			this.endName = endName;
			this.distance = distance;
			this.duration = duration;
		}

		getLatLon(forName) {

		}

		getName(forLatLon) {


		}
	};
	class SitterProfile {
		constructor(sitterInfo) {
			let sitterKeys = Object.keys(sitterInfo);
			
			this.sitterID = sitterInfo.providerid;
			this.sitterName = sitterInfo.sitter;
			this.fName = sitterInfo.fname;
			this.lName = sitterInfo.lname;
			this.status = sitterInfo.active;
			this.street1 = sitterInfo.street1;
			this.city = sitterInfo.city;
			this.state = sitterInfo.state;
			this.zip = sitterInfo.zip;
			this.sitterLat = sitterInfo.lat;
			this.sitterLon = sitterInfo.lon;

			this.showVisits = true;
		}
	};
	class SitterVisit {
		constructor(visitInfo) {

			this.visitID = visitInfo.appointmentid;
			this.status = visitInfo.status;
			this.service = visitInfo.service;

            let re = new RegExp('[0-9]+:[0-9]+');

			// YYYY-MM-DD hh:mm:ss
			if (visitInfo.arrived != null){
				let arriveTime = re.exec(visitInfo.arrived);
				let standardTime = moment(arriveTime, 'HH:mm:ss').format('h:mm A');
				this.arrived = standardTime; 
			}
			if (visitInfo.completed != null) {
				let completeTime = re.exec(visitInfo.completed);
				let standardTime = moment(completeTime, 'HH:mm:ss').format('h:mm A');
				this.completed = standardTime;
			}
			this.starttime = visitInfo.starttime;
			this.endtime = visitInfo.endtime;

			this.sitterID = visitInfo.providerptr;
			this.sitterName = visitInfo.sitter;
			
			this.lat = visitInfo.lat;
			this.lon = visitInfo.lon;
			this.pets = visitInfo.pets;
			this.clientID = visitInfo.clientptr;
			this.clientName = visitInfo.clientname;
			this.timeOfDay = visitInfo.timeofday;
			this.visitNote = visitInfo.note;
		}
	};
	class Pet {
		constructor(pet_data) {
			this.petID = pet_data['petid'];
			this.petName = pet_data['name'];
			this.petType = pet_data['type'];
			this.age = pet_data['birthday'];
			this.breed = pet_data['breed'];
			this.gender = pet_data['sex'];
			this.petColor = pet_data['color'];
			this.fixed = pet_data['fixed'];
			this.description = pet_data['description'];
			this.notes = pet_data['name'];
		}
	};
	class PetOwnerProfile {
		constructor(clientProfileInfo) {

			this.customFields = [];
			this.petImages = [];
			this.pets = [];

			this.client_id = clientProfileInfo['clientid'];
			this.petOwnerName = clientProfileInfo['clientname'];
			this.lname = clientProfileInfo['lname'];
			this.fname = clientProfileInfo['fname'];
			this.fname2 = clientProfileInfo['fname2'];
			this.lname2 = clientProfileInfo['lname2'];
			this.street1 = clientProfileInfo['street1'];
			this.street2 = clientProfileInfo['street2'];
			this.city = clientProfileInfo['city'];
			this.state = clientProfileInfo['state'];
			this.zip = clientProfileInfo['zip'];

			this.email = clientProfileInfo['email'];
			this.email2 = clientProfileInfo['email2'];

			this.cellphone = clientProfileInfo['cellphone'];
			this.cellphone2 = clientProfileInfo['cellphone2'];
			this.workphone = clientProfileInfo['workphone'];
			this.homephone = clientProfileInfo['homephone'];

			this.garagegatecode = clientProfileInfo['garagegatecode'];
			this.alarmcompany = clientProfileInfo['alarmcompany'];
			this.alarminfo = clientProfileInfo['alarminfo'];

			this.clinicptr = clientProfileInfo['clinicptr'];
			this.vetptr = clientProfileInfo['vetptr'];
			this.notes = clientProfileInfo['cellphone'];
			this.leashloc = clientProfileInfo['leashloc'];
			this.directions = clientProfileInfo['directions'];
			this.parkinginfo = clientProfileInfo['parkinginfo'];
			this.foodloc = clientProfileInfo['foodloc'];
			this.nokeyrequired = clientProfileInfo['nokeyrequired'];
			this.keyid = clientProfileInfo['keyid'];

			this.keydescription = clientProfileInfo['keydescription'];

			this.lat = clientProfileInfo['lat'];
			this.lon = clientProfileInfo['lon'];

			this.showkeydescriptionnotkeyid = clientProfileInfo['showkeydescriptionnotkeyid'];
			
			this.clinicname = clientProfileInfo['clinicname'];
			this.clinicstreet1 = clientProfileInfo['clinicstreet1'];
			this.clinicstreet2 = clientProfileInfo['clinicstreet2'];
			this.cliniccity = clientProfileInfo['cliniccity'];
			this.clinicstate = clientProfileInfo['clinicstate'];
			this.cliniczip = clientProfileInfo['cliniczip'];
			this.clinicphone = clientProfileInfo['clinicphone'];
			this.cliniclat = clientProfileInfo['cliniclat'];
			this.cliniclon = clientProfileInfo['cliniclon'];
			
			this.vetname = clientProfileInfo['vetname'];
			this.vetstreet1 = clientProfileInfo['vetstreet1'];
			this.vetstreet2 = clientProfileInfo['vetstreet2'];
			this.vetstate = clientProfileInfo['vetstate'];
			this.vetzip = clientProfileInfo['vetzip'];
			this.vetphone = clientProfileInfo['vetphone'];
			this.clinicphone = clientProfileInfo['clinicphone'];
			this.vetlat = clientProfileInfo['vetlat'];
			this.vetlon = clientProfileInfo['vetlon'];

			if (clientProfileInfo['emergency'] != null) {
				this.emergency_dict = clientProfileInfo['emergency'];
				this.emergency_name =this.emergency_dict['name'];
				this.emergency_location = this.emergency_dict['location'];
				this.emergency_homephone = this.emergency_dict['homephone'];
				this.emergency_workphone = this.emergency_dict['workphone'];
				this.emergency_cellphone= this.emergency_dict['cellphone'];
				this.emergency_note = this.emergency_dict['note'];
				this.emergency_hasKey = this.emergency_dict['haskey'];
			}
			if(clientProfileInfo['neighbor'] != null) {
				this.neighbor_dict = clientProfileInfo['neighbor'];
				this.neighbor_name = this.neighbor_dict['name'];
				this.neighbor_location = this.neighbor_dict['location'];
				this.neighbor_homephone = this.neighbor_dict['homephone'];
				this.neighbor_workphone = this.neighbor_dict['workphone'];
				this.neighbor_cellphone= this.neighbor_dict['cellphone'];
				this.neighbor_note = this.neighbor_dict['note'];
				this.neighbor_hasKey = this.neighbor_dict['haskey'];
			}

			this.parseCustomFields(clientProfileInfo);

			if (clientProfileInfo['pets'] != 0) {
				this.parsePetInfo(clientProfileInfo['pets']);
			}
		}
		parsePetInfo(petArr) {
			if(petArr != null) {
				let number_pets = petArr.length;
				petArr.forEach((petDict)=> {
					let clientPet = new Pet(petDict);	
					this.pets.push(clientPet);
				});
			}
			
		}
		parseCustomFields(customClient) {
			let re = new RegExp('custom[0-9]+');
			let keys = Object.keys(customClient);
			let customFieldsLocal = [];

			keys.forEach((clientKey) => { 

				if(re.exec(clientKey)) {
					let custom_dictionary = customClient[clientKey];
					let custom_key_val = {};
					if(custom_dictionary['value'] != null){
						custom_key_val[custom_dictionary['label']] = custom_dictionary['value'];
						customFieldsLocal.push(custom_key_val);
					}
				}
			});

			this.customFields = customFieldsLocal;
		}
	};

	function getSitters(){

		return sitterList;
	}
	function getVisitList() {

		return visitList;
	}
	function getClientList() {

		return allClients;
	}
	function getVisitsBySitterID(sitterID) {
	}
	function getVisitsBySitter(sitterID) {

		let visitListForSitter = [];

		visitList.forEach((visitDetails) => {

			if (visitDetails.sitterID == sitterID) {
				visitListForSitter.push(visitDetails);
			}

		});

		return visitListForSitter;
	}
	function addDistanceMatrixPair(distanceMatrixInfo, waypoints) {
		console.log(waypoints.length);
		let numWay = waypoints.length;
		for(let i = 0; i < numWay -1; i++) {
			let fromWaypoint =  waypoints[i];
			let toWaypoint =  waypoints[i+1];

			//console.log('FROM: '  + waypoints[i].name + ' --> ' + waypoints[i+1].name);
		}	

		let route_legs = distanceMatrixInfo.legs;
        let num_legs = distanceMatrixInfo.legs.length;
		let total_dist_check = 0;
		let total_duration_check= 0;
		let route_index = 0;
		route_legs.forEach((leg)=> {
			let waypointInfo = waypoints[route_index];
			let step_arr = leg.steps;
			route_index = route_index + 1;
            num_legs = num_legs - 1;
		});
	}
	function getDistanceMatrixPair(distanceMatrixLookupInfo) {
	}

	async function loginManager(username, password, role,startDate,endDate) {

		sitterList = [];
		visitList =[];
		allClients =[];

		console.log('Num sitter: ' + sitterList.length + ', Num visit: ' + visitList.length + ', Num client: ' + allClients.length);
		let url = 'http://localhost:3300?type=mmdLogin&username='+username+'&password='+password+'&role='+role+'&startDate='+startDate+'&endDate='+endDate;
		
		const response = await fetch(url);
		const myJson = await response.json();
	}
	async function getManagerData() {
		sitterList = [];
		visitList =[];
		allClients =[];

		let base_url = 'http://localhost:3300?type=gSit';		
		const response = await fetch(base_url);
		const myJson = await response.json();

		myJson.forEach((sitterProfile) => {
			let nSitterProfile = new SitterProfile(sitterProfile);
			sitterList.push(nSitterProfile);
		});
		return sitterList;
	}
	async  function getManagerVisits() {
		let base_url = 'http://localhost:3300?type=gVisit';		
		const response = await fetch(base_url);
		const myJson = await response.json();
		myJson.forEach((visit) => {
			let nVisitProfile = new SitterVisit(visit);
			visitList.push(nVisitProfile);	
		});
		return visitList;
	}
	async function getManagerClients() {
		let base_url = 'http://localhost:3300?type=gClients';		
		const response = await fetch(base_url);
		const myJson = await response.json();
		myJson.forEach((client) => {
			let petOwner = new PetOwnerProfile(client);
			allClients.push(petOwner);	
		});
		return allClients;
	}
	async function getVisitReportList(clientID, startDate, endDate, visitID) {

		let url = 'http://localhost:3300?type=visitReportList&clientID='+clientID+'&startDate='+startDate+'&endDate='+endDate;
		console.log('Called visitReportList for: ' + clientID);
		let vrListRequest = await fetch(url);
		let vrListJson = await vrListRequest.json();
		
		vrListJson.forEach((vrItem) => {
			let vrListItem = new VisitReportListItem(vrItem);
			let vrApptID = vrItem.appointmentid;
			let vrExtUrl = vrItem.externalurl;
			console.log(vrApptID + ' -> ' + vrExtUrl);
			vrListDic[vrApptID] = vrExtUrl;
			vrList.push(vrListItem);
		});
		vrList.forEach((vrListItem)=> {
			console.log(vrListItem.visitID);
		})
		return vrList;
	}
	async function getVisitReport(visitID) {
		let getURL = vrListDic[visitID];
		let url = 'http://localhost:3300?type=visitReport&getURL='+visitID;
		let vrDetailResponse = await fetch(url);
		let vrDetailJson  = await vrDetailResponse.json();
		return vrDetailJson;
	}

	return {

		getSitters : getSitters,
		getVisitList : getVisitList,
		getClientList : getClientList,
		loginManager : loginManager,
		getManagerData : getManagerData,
		getManagerVisits : getManagerVisits,
		getManagerClients : getManagerClients,
		getVisitsBySitterID : getVisitsBySitterID,
		getVisitsBySitter : getVisitsBySitter,
		addDistanceMatrixPair : addDistanceMatrixPair,
		getDistanceMatrixPair : getDistanceMatrixPair,
		getVisitReportList : getVisitReportList,
		getVisitReport : getVisitReport
	}

	modules.exports = {
		sitterList : sitterList,
		visitList : visitList,
		allClients : allClients,
		visitReportList : visitReportList,
		SitterVisit : SitterVisit,
		SitterProfile : SitterProfile,
		PetOwnerProfile : PetOwnerProfile,
		Pet : Pet,
		DistanceMatrixPair : DistanceMatrixPair,
		VisitReport : VisitReport,
		VisitReportListItem : VisitReportListItem,
		visitReportListDict : visitReportListDict
	}

} ());