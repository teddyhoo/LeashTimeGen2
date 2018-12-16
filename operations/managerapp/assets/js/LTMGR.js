var LTMGR = (function() {
	
	"use strict";


	var sitterList = [];
	var visitList = []; 
	var allClients = [];
	var distanceMatrix = [];
	var sitterDistanceData = [];

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
	}
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

	function loginManager(username, password, role,startDate,endDate) {
		let successLogin = false;
		sitterList = [];
		visitList =[];
		allClients =[];

		console.log('Num sitter: ' + sitterList.length + ', Num visit: ' + visitList.length + ', Num client: ' + allClients.length);
		let url = 'http://localhost:3300?type=mmdLogin&username='+username+'&password='+password+'&role='+role+'&startDate='+startDate+'&endDate='+endDate;
		fetch(url)
			.then((response)=> {
				return response.json();
			})
			.then((managerJSON)=> {
				let keys = Object.keys(managerJSON);
				if (managerJSON.managerData == 'ok') {
					console.log('MANAGER DATA OK');
					return true;
				}

			});
			//.catch((error) => {
			//	console.log('manager login error');
			//});
	}
	function getManagerData() {
		sitterList = [];
		visitList =[];
		allClients =[];

		let base_url = 'http://localhost:3300?type=gSit';		
		fetch(base_url)
			.then((response) => {
				return response.json();
			})
			.then((myJson)=> {
				myJson.forEach((sitterProfile) => {
					let nSitterProfile = new SitterProfile(sitterProfile);
					sitterList.push(nSitterProfile);
					let sitterID = sitterProfile.providerid;
					console.log(sitterID);
					let sitterProfileString = JSON.stringify(sitterProfile);
					console.log(sitterProfileString);	
				})
			});
	}
	function getManagerVisits() {
		let base_url = 'http://localhost:3300?type=gVisit';		
		fetch(base_url)
			.then((response) => {
				return response.json();
			})
			.then((myJson)=> {
				myJson.forEach((visit) => {
					let nVisitProfile = new SitterVisit(visit);
					visitList.push(nVisitProfile);	
				})
			});
	}
	function getManagerClients() {
		let base_url = 'http://localhost:3300?type=gClients';		
		fetch(base_url)
			.then((response) => {
				return response.json();
			})
			.then((myJson)=> {
				myJson.forEach((client) => {
					let petOwner = new PetOwnerProfile(client);
					allClients.push(petOwner);	
				})
			});
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
		getDistanceMatrixPair : getDistanceMatrixPair
	}

	modules.exports = {
		sitterList : sitterList,
		visitList : visitList,
		allClients : allClients,
		SitterVisit : SitterVisit,
		SitterProfile : SitterProfile,
		PetOwnerProfile : PetOwnerProfile,
		Pet : Pet,
		DistanceMatrixPair : DistanceMatrixPair
	}

} ());