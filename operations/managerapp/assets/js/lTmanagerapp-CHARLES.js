//(function(namespace, $){
//  "use strict";

///////////////////// CHARLES VERSION OF LTMANAGERAPP.JS
//////////////////////////////////////////////////////////////////////
    const delay = 3000;
    var allVisits = [];
    var allSitters= [];
    var allClients =[];
    var visitsBySitter =  {};
    var petImages = []
    var mapMarkers = [];
    var statusVisit = {
        'future' : 'on',
        'late' : 'on',
        'canceled' : 'on',
        'completed' : 'on',
        'visitreport' : 'on',
        'arrived' : 'on'
    };

    var sitterIcons = ["marker1", "marker2","marker3","marker4"];
    const  dayArrStr = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
    const monthsArrStr = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
               
    mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v9',
        center : ([-77.888,38.1111]),
        zoom: 9
    });

    map.on("load",()=>{
                

    });

    function login() {
            console.log('Logging in - cleaning up');
            removeSittersFromSitterList();
            removeAllMapMarkers();
            removeVisitDivElements();
            console.log('Logging in - emptying variables');

            allVisits = [];
            allSitters = [];
            allClients =[];
            visitsBySitter = [];
            mapMarkers = [];

            let username = document.getElementById('userName').value;
            let password = document.getElementById('passWord').value;

            var userRole = 'm';

            var fullDate = getFullDate();
            var todayDateLocal = new Date();

            let loginPromise = new Promise(function(resolve, reject) {
                console.log('Logging in with: ' + username + ' and ' + password);
                let url = 'http://localhost:3300?type=mmdLogin&username='+username+'&password='+password+'&role='+userRole+'&startDate='+fullDate+'&endDate='+fullDate;
                fetch(url)
                    .then((response)=> {
                        console.log('Fetch response');
                        return response.json();
                    })
                    .then((managerJSON)=> {
                        let keys = Object.keys(managerJSON);
                        if (managerJSON.managerData == 'ok') {
                            console.log('MANAGER DATA OK');
                        }
                        resolve('ok');
                    });
            });

            loginPromise.then(function(done) {
                console.log('Promise done');
                LTMGR.getManagerData();
                LTMGR.getManagerVisits();
                LTMGR.getManagerClients();
                console.log(done);
                return done;
            })
            .then(function(done) {

                console.log('SECOND DONE ON REQUESTS');
                var loginPanel = document.getElementById("lt-loginPanel");
                loginPanel.setAttribute("style", "display:none");
                var sitterNameVisits  = setInterval(()=> {
                    console.log('GETTING FINISHED VISITS: ');
                    allVisits = LTMGR.getVisitList();
                    allSitters = LTMGR.getSitters();
                    allClients = LTMGR.getClientList();

                    flyToFirstVisit();
                    buildSitterButtons(allVisits, allSitters);
                    clearInterval(sitterNameVisits);
                    removeElement(password);
                    removeElement(username);
                    let loginButton = document.getElementById('login');
                    loginButton.innerHTML = "UPDATE";
                }, 1000);
                return(done);
            });          
        }
        function showLoginPanel() {
          var loginPanel = document.getElementById("lt-loginPanel");
                loginPanel.setAttribute("style", "display:block");
        }
        function flyToFirstVisit() {
            if (allVisits[0] != null) {
                 let lastVisit = allVisits[0];
                if (lastVisit.lon != null && lastVisit.lat != null && lastVisit.lon > -90 && lastVisit.lat < 90 ) {
                    map.flyTo({
                        center: [lastVisit.lon, lastVisit.lat],
                        zoom: 16
                    });
                } else {
                    console.log('invalid lat or lon coordinate')
                }
            }
        }
        function getFullDate() {
            var todayDate = new Date();
            let todayMonth = todayDate.getMonth()+1;
            let todayYear = todayDate.getFullYear();
            let todayDay = todayDate.getDate();

            let dayOfWeek = todayDate.getDay();

            let dayWeekLabel = document.getElementById('dayWeek');
            dayWeekLabel.innerHTML = dayArrStr[dayOfWeek] + ', ';
            let monthLabel = document.getElementById('month');
            monthLabel.innerHTML = monthsArrStr[todayMonth-1];
            let dateLabel = document.getElementById("dateLabel");
            dateLabel.innerHTML = todayDay;
            return todayYear+'-'+todayMonth+'-'+todayDay;
        }
        function prevDay() {
        }
        function nextDay() {
        }
        
        function buildSitterButtons(allSitterVisits, allSittersInfo) {
            allSittersInfo.forEach((sitter)=> {
                let hasVisits = false;
                let sitterCount = parseInt(0);

                allSitterVisits.forEach((visitDetails)=> {
                    if (sitter.sitterID == visitDetails.sitterID) {
                        hasVisits = true;
                        createMapMarker(visitDetails, sitterIcons[sitterCount]);
                        sitterCount = sitterCount + 1;
                    }
                });

                if (hasVisits) {
                    createSitterMapMarker(sitter);
                    
                    let sitterListDiv = document.getElementById("sitterList");
                  
                    let sitterFilterButton = document.createElement("button");
                    sitterFilterButton.setAttribute("type", "button");
                    sitterFilterButton.setAttribute("id", sitter.sitterID);
                    sitterFilterButton.setAttribute("class", "btn btn-block");
                    let spanEl = document.createElement("span");
                    spanEl.setAttribute("class", "pull-left");
                    sitterFilterButton.appendChild(spanEl);
                    sitterFilterButton.innerHTML = sitter.sitterName + ' (' + sitterCount + ')';
                    sitterListDiv.appendChild(sitterFilterButton);
                    document.getElementById(sitter.sitterID).addEventListener("click", removeVisitDivElements);  
                    document.getElementById(sitter.sitterID).addEventListener("click", removeAllMapMarkers);
                    document.getElementById(sitter.sitterID).addEventListener("click",function() {showVisitBySitter(sitter.sitterID);});
                    visitsBySitter[sitter.sitterID] = sitterCount;
                }
            });
        }

        function createSitterPopup(sitterInfo) {
          
          

            let popupBasicInfo = '<h1>'+sitterInfo.sitterName+'</h1>';
            var listClients = LTMGR.getClientList();

            popupBasicInfo += '<p>'+sitterInfo.street1 +'</p>';
            popupBasicInfo += '<p>'+sitterInfo.city+'</p>';
            popupBasicInfo += '<p>Number of visits</p>';

            popupBasicInfo += '<p><img src=\"./assets/img/postit\-20x20.png\" width=20 height=20>&nbsp&nbsp<input type=\"text\" name=\"messageSitter\" id=\"messageSitter\"></p>';

            return popupBasicInfo;
        }
      
        function createVRPopup(VRInfo) {
            //let popupVR = document.createElement("div");
            //popupVR.innerHTML 
            let popupVR = '<div class="card style-info"><div class="card-head"><section id="lt-vrCard" class="full-bleed force-padding"><div class="section-body style-default-dark force-padding text-shadow" style="overflow: hidden;"><div id="imgHolder" class="img-backdrop responsive-image" style="background-image: url("https://leashtime.com/public/sandbox-new/email/visit-reports/assets/img/pic-dogsun.jpg");" onclick="swapPhotoMap();"></div><div class="overlay overlay-shade-top stick-top-left height-3"></div><div class="stick-top-left"><div class="text-light force-padding"><i class="fa fa-photo"></i><strong> CARE</strong>REPORTS&trade;</div></div><div class="row"><div class="col-xs-12 no-padding"><div class="width-3 text-center pull-right" style="line-height:1;"><div class=""><strong class="text-lg no-margin"><span class="vrd" data-vrdata="vrdate">11/19/18</span></strong><br><span class=" text-xs text-light opacity-75"><span class="vrd" data-vrdata="servicelabel">30 Minute Walk</span></span></div></div></div></div><div class="overlay overlay-shade-bottom stick-bottom-left text-right"></div><div class="stick-bottom-right text-right force-padding"><div class="btn-group"><div class="btn-group"><a href="#" class="btn btn-icon-toggle dropdown-toggle" data-toggle="dropdown"><i class="md md-map md-2x"></i></a><ul class="dropdown-menu animation-dock pull-right menu-card-styling" role="menu" style="text-align: left;"><li><a href="javascript:void(0);" data-style="style-default-dark"><i class="fa fa-paw fa-fw text-default-dark"></i> Peed</a></li></ul> </div><div class="btn-group"><a href="#" class="btn btn-icon-toggle dropdown-toggle" data-toggle="dropdown"><i class="fa fa-paw "></i></a><ul class="dropdown-menu animation-dock pull-right menu-card-styling" role="menu" style="text-align: left;"><li><a href="javascript:void(0);" data-style="style-default-dark"><i class="fa fa-paw fa-fw text-default-dark"></i> Pooped</a></li></ul></div><div class="btn-group"> <a href="#" class="btn btn-icon-toggle dropdown-toggle" data-toggle="dropdown"><i class="md md-colorize "></i></a> <ul class="dropdown-menu animation-dock pull-right menu-card-styling" role="menu" style="text-align: left;"><li><a href="javascript:void(0);" data-style="style-default-dark"><i class="fa fa-paw fa-fw text-default-dark"></i> Feeling Sick</a></li> </ul> </div></div> </div> <div class="stick-bottom-left force-padding"><img id="vrMap" class="large-box-shadow mg-responsive auto-width" src="https://LeashTime.com/appointment-map.php?token=pslvp"  style="width:18%;border-radius: 6px;" alt="Map "></div></div></section></div><header><strong>CARE</strong>VISIT™ COMPLETE</header></div><div class="card-body"><small>ADD VISIT NOTE</small><textarea class="form-control control-12-rows">12 rows</textarea></div><div class="card-actionbar"> <div class="card-actionbar-row text-white"><a href="javascript:void(0);" class="btn btn-icon-toggle btn-default ink-reaction pull-left"><i class="fa fa-edit"></i></a><button href="javascript:void(0);" class="btn btn-flat ink-reaction btn-info">SEND VISIT REPORT</button> </div></div></div>'
            return popupVR;
        }
     
        function createSitterMapMarker(sitterInfo) {
            let el = document.createElement('div');
            let latitude = parseFloat(sitterInfo.sitterLat);
            let longitude = parseFloat(sitterInfo.sitterLon);
            console.log('SITTER MAP MARKER: ' + latitude + ' ' + longitude)
            let popupView;
            if (latitude != null && longitude != null && latitude < 90 && latitude > -90) {
                popupView = createSitterPopup(sitterInfo);
                el.class = 'sitter';
                el.id = 'sitter';

                let popup = new mapboxgl.Popup({offset : 25})
                    .setHTML(popupView);

                if (latitude > 90 || latitude < -90 ) {
                    console.log("Lat error");
                } else {
                    let marker = new mapboxgl.Marker(el)
                        .setLngLat([longitude,latitude])
                        .setPopup(popup)
                        .addTo(map);

                    mapMarkers.push(marker);
                }
            }
        }
        
        function createMapMarker(visitInfo, markerIcon) {

            let el = document.createElement('div');
            let latitude = parseFloat(visitInfo.lat);
            let longitude = parseFloat(visitInfo.lon);
            let popupView;
          
            if (latitude != null && longitude != null && latitude < 90 && latitude > -90) {
                popupView = createPopupView(visitInfo);
                
                el.setAttribute("class", "mapMarker");
                
                if (visitInfo.status == 'completed') {
                  el.innerHTML = '<button type="button" class="btn btn-lg ink-reaction btn-floating-action btn-success active"><i class="fa fa-check-circle fa-2x"></i></button>';
                } else if (visitInfo.status == 'canceled') {
//                     el.setAttribute("class", "marker-canceled");
                  el.innerHTML = '<button type="button" class="btn btn-lg ink-reaction btn-floating-action btn-danger active"><i class="fa fa-minus-circle fa-2x"></i></button>';
                } else if (visitInfo.status == 'late') {
//                     el.setAttribute("class", "marker-late");
                  el.innerHTML = '<button type="button" class="btn btn-lg ink-reaction btn-floating-action btn-warning active"><i class="fa fa-warning fa-2x"></i></button>';
                } else if (visitInfo.status == 'arrived') {
//                     el.setAttribute("class", "marker-arrived");
                  el.innerHTML = '<button type="button" class="btn btn-lg ink-reaction btn-floating-action btn-info active"><i class="fa fa-home fa-2x"></i></button>';
                } else if (visitInfo.status == 'future' || visitInfo.status == 'incomplete') {
                     el.innerHTML = '<button type="button" class="btn btn-lg ink-reaction btn-floating-action btn-default active"><i class="fa fa-paw fa-2x"></i></button>'
                }

                let popup = new mapboxgl.Popup({offset : 25})
                    .setHTML(popupView);

                if (latitude > 90 || latitude < -90 ) {
                    console.log("Lat error");
                } else {
                    let marker = new mapboxgl.Marker(el)
                        .setLngLat([longitude,latitude])
                        .setPopup(popup)
                        .addTo(map);

                    mapMarkers.push(marker);
                }
            }
        }
        
        function createPopupView(visitInfo, divElement) {
          visitInfo.sitterName;
          visitInfo.clientName;
          visitInfo.service;
          
          
let popupBasicInfo = '<div class="card card-bordered style-primary"><div class="card-head"><div class="tools"><div class="btn-group"><a class="btn btn-icon-toggle btn-refresh"><i class="md md-refresh"></i></a><a class="btn btn-icon-toggle btn-collapse"><i class="fa fa-angle-down"></i></a><a class="btn btn-icon-toggle btn-close"><i class="md md-close"></i></a></div></div><header class="">'+visitInfo.service+'</header></div><div class="card-body p-t-0"><p><span class="text-default">SHEDULED: </span>' + visitInfo.starttime + ' - ' + visitInfo.endtime + '</p><p class="no-margin no-padding"><span class="text-default">SITTER: </span>'+visitInfo.sitterName +'</p><p class="no-margin no-padding"><span class="text-default">CLIENT: '+visitInfo.clientName+'</p></div></div>';


//            let popupBasicInfo = '<h1>'+visitInfo.pets+'</h1>';
            var listClients = LTMGR.getClientList();

            listClients.forEach((client) => {
              
              
              /*
                if(visitInfo.clientID == client.client_id) {
                    popupBasicInfo += '<div class=\"petProfilePhotos\" id=\"' + client.client_id + '\">';
                    let petCount = 0;
                    client.pets.forEach((pet)=> {
                        let url = '<img src=\"./assets/img/dog'+petCount+ '.jpg\" id=\"petPhoto\" width=100 height=100 onopen=fetchPetPhoto()>&nbsp&nbsp';
                        let imageComponent = url;
                        popupBasicInfo += imageComponent;
                        petCount = petCount + 1;
                    });

                    popupBasicInfo += '</div>';
                    if (client.street2 != null) {
                        popupBasicInfo += '<p>' + client.street1 + ', ' +client.street2;
                    } else {
                        popupBasicInfo += '<p>' + client.street1
                    }

                }*/
            });

//            popupBasicInfo += '<p class="no-margin no-padding">'+visitInfo.sitterName +'</p>';
//            popupBasicInfo += '<p class="no-margin no-padding">'+visitInfo.clientName+'</p>';
//            popupBasicInfo += '<p class="no-margin no-padding">'+visitInfo.service+'</p>';
            
            if (visitInfo.status == 'completed') {
                popupBasicInfo += '<div class=\"card\"><div class=\"card-header no-margin\"><p class=\"alert alert-success no-margin\"><i class=\"fa fa-compass\"> COMPLETE: </i> '+visitInfo.timeOfDay+'</p></div>';
//                popupBasicInfo += '<p>Started: ' + visitInfo.starttime + ' - ' + visitInfo.endtime + '</p>';
            } else if (visitInfo.status == 'late') {
                popupBasicInfo += '<div class=\"card\"><div class=\"card-header no-margin\"><p class=\"alert alert-warning no-margin\"><i class=\"fa fa-warning\"> LATE: </i> '+visitInfo.timeOfDay+'</p></div>';
            } else if (visitInfo.status == 'future') {
                popupBasicInfo += '<div class=\"card\"><div class=\"card-header no-margin\"><p class=\"alert alert-info no-margin\"><i class=\"fa fa-wifi\"> FUTURE: </i> '+visitInfo.timeOfDay+'</p></div>';
            } else if (visitInfo.status == 'canceled') {
                popupBasicInfo += '<div class=\"card\"><div class=\"card-header no-margin\"><p class=\"alert alert-danger no-margin\"><i class=\"fa fa-ban\"> CANCELED: </i> '+visitInfo.timeOfDay+'</p></div>';
            }

            if (visitInfo.visitNote != null) {
                popupBasicInfo += "<div class=\"card\"><p><img src=\"./assets/img/postit\-20x20.png\" width=20 height=20>"+visitInfo.visitNote+"</p>";
            }

//            popupBasicInfo += '<p><img src=\"./assets/img/postit\-20x20.png\" width=20 height=20>&nbsp&nbsp<input type=\"text\" name=\"messageSitter\" id=\"messageSitter\"></p>';
          
           popupBasicInfo += '<div class=\"card-body small-padding p-t-0 p-b-0\"><div class=\"form-group floating-label m-t-0 p-t-0\"><textarea name=\"messageSitter\" id=\"messageSitter\" class=\"form-control text-sm\" rows=\"3\"></textarea><label for=\"messageSitter\"><i class=\"fa fa-note icon-tilt-alt\"></i> Visit Notes</label></div></p></div><div class="card-actionbar"><div class="card-actionbar-row no-padding"><a href="javascript:void(0);" class="btn btn-icon-toggle btn-danger ink-reaction pull-left"><i class="fa fa-heart"></i></a><a href="javascript:void(0);" class="btn btn-icon-toggle btn-default ink-reaction pull-left"><i class="fa fa-reply"></i></a><a href="javascript:void(0);" class="btn btn-flat btn-default-dark ink-reaction">SEND</a></div></div></div>';

            return popupBasicInfo;
          
//            return createVRPopup();
          
        }
       
        function filterMapViewByVisitStatus(filterStatus) {

            if (statusVisit[filterStatus] == 'on') {
                statusVisit[filterStatus] =  'off';
            } else {
                statusVisit[filterStatus] = 'on';
            }

            let visitFilterArray = [];
            mapMarkers.forEach((marker)=>{
                marker.remove();
            });

            let allVisits = LTMGR.getVisitList();
            let statKeys = Object.keys(statusVisit);

            allVisits.forEach((visitDetails)=> {
                let visitStatus = visitDetails.status;
                console.log(visitStatus);
                if (statusVisit[visitStatus] == 'on' && visitDetails.status == visitStatus) {
                    visitFilterArray.push(visitDetails);
                }
            });
            visitFilterArray.forEach((visit) => {
                createMapMarker(visit,'marker');
            });
        }
        
        function showVisitBySitter(sitterID){

            removeVisitDivElements();
            removeAllMapMarkers();

            let visitListBySitter = [];

            allVisits.forEach((visitDetails)=> {
                if (visitDetails.sitterID == sitterID) {
                    visitListBySitter.push(visitDetails);
                    createVisitHTML(visitDetails);
                    createMapMarker(visitDetails,'marker');
                }
            });

            let lastVisit = visitListBySitter[visitListBySitter.length -1]

            map.flyTo({
                center: [parseFloat(lastVisit.lon), parseFloat(lastVisit.lat)],
                zoom: 18
            });
            
        }
        
        function removeVisitDivElements() {
            var element = document.getElementById("visitListByClient");
            while (element.firstChild) {
                element.removeChild(element.firstChild);
            }
        }
        
        function removeSittersFromSitterList() {

            var element = document.getElementById("sitterList");
            while (element.firstChild) {
                element.removeChild(element.firstChild);
            }

        }
        
        function removeAllMapMarkers() {
            mapMarkers.forEach((marker)=>{
                marker.remove();
            });
        }
      
        function createVisitHTML(visitDetails) {       
          
          
//          <ul class="list">
//  <li class="tile">
//    
//    <a class="btn btn-flat btn-danger ink-reaction">
//      <i class="glyphicon glyphicon-heart"></i>
//    </a>
//    
//    <a class="tile-content ink-reaction" href="#2">
//      <div class="tile-text">
//        Abbey Johnson
//        <small>Last visit: Today</small>
//      </div>
//      <div class="tile-icon">
//        <img src="http://www.codecovers.eu/assets/img/modules/materialadmin/avatar9.jpg?1422538626" alt="">
//      </div>
//    </a>
//  </li>
//</ul>
//      
//      
//        function createVisitHTML(visitDetails) {                        
//            let visitDiv = document.getElementById("visitListByClient");
//          
//            let listi = document.createElement('li');
//            listi.setAttribute("class", "tile");
//            
//            let listStatus = document.createElement('a');
//            listStatus.setAttribute("class", "btn btn-flat btn-danger ink-reaction");
//          
//            let listicon = document.createElement('i');
//            listicon.setAttribute("class", "+  +");
//          
          
//          <li class="tile">
//									<a class="tile-content ink-reaction">
//										<div class="tile-text">
//											Alex Nelson
//											<small>
//												Secondary text lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
//											</small>
//										</div>
//										<div class="tile-icon">
//											<img src="http://www.codecovers.eu/assets/img/modules/materialadmin/avatar12.jpg?1422538623" alt="">
//										</div>
//									</a>
//								</li>
          
          
          let visitList = document.createElement("li");
          visitList.setAttribute("class", "tile");
          let visitLink = document.createElement("a");         
          visitLink.setAttribute("class", "tile-content", "ink-reaction");

          let visitLabel = document.createElement("div");

          let visitDiv = document.getElementById("visitListByClient");
          //visitDiv.appendChild(visitList);
          //visitList.appendChild(visitLink);
          //visitLink.appendChild(visitLabel); 

          visitDiv.appendChild(visitLabel); 
          visitLabel.id = visitDetails.visitID;
          visitLabel.setAttribute("class", "tile-text", "full-Bleed");
          visitLabel.setAttribute("name", visitDetails.clientName);
          visitLabel.classList.add('alert','alert-callout');
          
//            visitLabel.setAttribute("type", "button");
            let fLat = parseFloat(visitDetails.lat);
            let fLon = parseFloat(visitDetails.lon);
            visitLabel.addEventListener('click' , function() {
                console.log(fLat + ' ' + fLon);
                map.flyTo({
                    center: [fLon, fLat],
                    zoom: 18
                });
            });
            visitLabel.innerHTML = visitDetails.clientName;

             if(visitDetails.status == 'late') {
                visitLabel.classList.add("alert-warning");
            } else if (visitDetails.status == "completed") {
                 visitLabel.classList.add("alert-success");
            } else if (visitDetails.status == "canceled") {
                 visitLabel.classList.add("alert-danger");
            }
            visitDiv.appendChild(visitLabel);
        }
//}(this.managerapp, jQuery));