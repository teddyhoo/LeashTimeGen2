

        const delay = 3000;
        const base_url = 'https://leashtime.com';
        var fullDate;

        let username = '';
        let password = '';
        var userRole = 'm';

        var allVisits = [];
        var allSitters= [];
        var allClients =[];
        var visitsBySitter =  {};
        var petImages = []
        var mapMarkers = [];
        var showSitter = {};
        var trackSitterMileage = [];

        var totalVisitCount = parseInt(0);
        var totalCancelVisitCount = parseInt(0);
        var re = /([0-9]+):([0-9]+):([0-9]+)/

        var moodButtonMap = {
            'poo' : 'dog-poo@3x.png',
            'pee' : 'dog-pee-firehydrant@3x.png',
            'play' : 'play-icon-red@3x.png',
            'happy' : 'happy-icon-red@3x.png',
            'shy' : 'shy-icon-red@3x.png',
            'sad' : 'sad-dog-red@3x.png',
            'sick' : 'sick-icon-red@3x.png',
            'litter' : 'kitty-litter@3x.png',
            'angry' : 'angry-icon-red@3x.png',
            'cat' : 'catsit-black-red@3x.png',
            'hungry' : 'hungry-icon-red@3x.png'
        };

        var statusVisit = {
            'future' : 'on',
            'late' : 'on',
            'canceled' : 'on',
            'completed' : 'on',
            'visitreport' : 'on',
            'arrived' : 'on'
        };

        var total_miles = 0;
        var total_duration_all = 0;
        var onWhichDay = '';
        var cookieVal;

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

        function prevDay() {
            console.log('ON WHICH DAY CURRENT: ' + onWhichDay.getFullYear() + '-' + onWhichDay.getMonth() + '-' + onWhichDay.getDate());
            onWhichDay.setDate(onWhichDay.getDate()-1)
            let monthDate = onWhichDay.getMonth() + 1;
            let monthDay = onWhichDay.getDate();
            let dateRequestString = onWhichDay.getFullYear() + '-' + monthDate+ '-' + monthDay;
            console.log('REQUESTING FOR DATE: ' + dateRequestString);
            updateDateInfo();
            fullDate = dateRequestString;
            prevDaySteps(dateRequestString);

            removeSittersFromSitterList();
            removeAllMapMarkers();
            removeVisitDivElements();
        }
        function nextDay() {

            console.log('ON WHICH DAY CURRENT: ' + onWhichDay.getFullYear() + '-' + onWhichDay.getMonth() + '-' + onWhichDay.getDate());

            onWhichDay.setDate(onWhichDay.getDate()-1)
            let monthDate = onWhichDay.getMonth() + 1;
            let monthDay = onWhichDay.getDate();
            let dateRequestString = onWhichDay.getFullYear() + '-' + monthDate+ '-' + monthDay;
            console.log('REQUESTING FOR DATE: ' + dateRequestString);
            updateDateInfo();
            fullDate = dateRequestString;
            updateDateInfo(prevNewDate);
            login(dateRequestString);

            removeSittersFromSitterList();
            removeAllMapMarkers();
            removeVisitDivElements();

        }
        async function prevDaySteps(loginDate) {

            allVisits = [];
            allSitters = [];
            allClients =[];

            let url = 'http://localhost:3300?type=mmdLogin&username='+username+'&password='+password+'&role='+userRole+'&startDate='+loginDate+'&endDate='+loginDate;
            const loginFetchResponse = await fetch(url);
            const response = await loginFetchResponse.json();

            const sitterListAfterLogin = LTMGR.getManagerData();
            await sitterListAfterLogin.then((results)=> {
                allSitters = results;
            });

            const visitListAfterLogin = LTMGR.getManagerVisits();
            await visitListAfterLogin.then((results)=> {
                allVisits = results;
            })

            const clientsAfterLogin = LTMGR.getManagerClients();
            await clientsAfterLogin.then((results)=> {
                allClients = results;
            });

            visitsBySitter = [];
            mapMarkers = [];
        
            flyToFirstVisit();
            buildSitterButtons(allVisits, allSitters);
        }
        function login(loginDate) {
            removeSittersFromSitterList();
            removeAllMapMarkers();
            removeVisitDivElements();

            allVisits = [];
            allSitters = [];
            allClients =[];
            visitsBySitter = [];
            mapMarkers = [];

            setupLoginSteps(loginDate, false);
        }
        async function setupLoginSteps(loginDate, isUpdate) {
            
            if (!isUpdate) {
                const managerLoginFetch =  loginPromise();
                await managerLoginFetch;
            }

            const sitterListAfterLogin = LTMGR.getManagerData();
            await sitterListAfterLogin.then((results)=> {
                allSitters = results;
            });

            const visitListAfterLogin = LTMGR.getManagerVisits();
            await visitListAfterLogin.then((results)=> {
                allVisits = results;
            })

            const clientsAfterLogin = LTMGR.getManagerClients();
            await clientsAfterLogin.then((results)=> {
                allClients = results;
            });


            //allVisits.forEach((visit)=> {
             //   console.log(visit.visitID);
            //})
        
            flyToFirstVisit();
            buildSitterButtons(allVisits, allSitters);
            //let loginButton = document.getElementById('login');
            //loginButton.innerHTML = "UPDATE";
        }
        async function loginPromise(loginDate) {

            if (username == '') {
                username = document.getElementById('userName').value;
            }
            if (password == '') {
                password = document.getElementById('passWord').value;
            }
            if (document.getElementById('login').innerHTML == 'LOGIN') {
                let usernameNode = document.getElementById('userName');
                usernameNode.parentNode.removeChild(usernameNode);
                let passwordNode = document.getElementById('passWord')
                passwordNode.parentNode.removeChild(passwordNode);
                document.getElementById('login').innerHTML = 'UPDATE';
            }

            if (loginDate == null) {
                fullDate = getFullDate();
            } else {
                fullDate = loginDate;
            }

            let url = 'http://localhost:3300?type=mmdLogin&username='+username+'&password='+password+'&role='+userRole+'&startDate='+fullDate+'&endDate='+fullDate;
            let loginFetchResponse;
            let response;
            try {
                loginFetchResponse = await fetch(url);
            } catch (error) {
                console.log('Login fetch response error');
                return error;
            }
            try {
                response = await loginFetchResponse.json();
                console.log(response);
            } catch(error) {
                console.log('Response error ');
            }
        }        
        function buildSitterButtons(allSitterVisits, allSittersInfo) {
            totalVisitCount = parseInt(0);
            totalCancelVisitCount = parseInt(0);

            allSittersInfo.forEach((sitter)=> {
                let hasVisits = false;
                let sitterCount = parseInt(0);

                allSitterVisits.forEach((visitDetails)=> {
                    if (sitter.sitterID == visitDetails.sitterID) {
                        hasVisits = true;
                        createMapMarker(visitDetails, 'marker');
                        sitterCount = sitterCount + 1;
                        totalVisitCount = totalVisitCount + 1;
                        if (visitDetails.status == 'canceled') {
                            totalCancelVisitCount = totalCancelVisitCount + 1;
                        }
                    }
                });

                if (hasVisits) {
                    createSitterMapMarker(sitter, 'marker');
                    showSitter[sitter.sitterID] = false;
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
                    document.getElementById(sitter.sitterID).addEventListener("click",function() {showVisitBySitter(sitter);});
                    visitsBySitter[sitter.sitterID] = sitterCount;
                }
            });

            let visitCounter = document.getElementById('numVisits');
            visitCounter.innerHTML = 'TOTAL VISITS: ' + totalVisitCount + ' CANCELED: ' + totalCancelVisitCount;
        }
        function createMapMarker(visitInfo, markerIcon) {

            let el = document.createElement('div');
            el.setAttribute("class", "marker");
            el.setAttribute("id", visitInfo.appointmentid);

            let latitude = parseFloat(visitInfo.lat);
            let longitude = parseFloat(visitInfo.lon);
            let marker = new mapboxgl.Marker(el);
            let popup = new mapboxgl.Popup({offset : 25})
            marker.setPopup(popup);                                         


            if (latitude != null && longitude != null && latitude < 90 && latitude > -90) {

                if (latitude > 90 || latitude < -90 ) {
                    console.log("Lat error");
                } else {
                    marker.setLngLat([longitude,latitude])
                                .addTo(map);
                    mapMarkers.push(marker);
                }       

                el.addEventListener("click", async function(event) {

                    let popupView;
                    let isAvailable = false;
                    let vrListLinks;

                    //removeSittersFromSitterList();
                    //removeVisitDivElements();


                    let vrList = LTMGR.getVisitReportList(visitInfo.clientID, '2018-12-01', fullDate, visitInfo.visitID);
                    await vrList.then((vrListItems)=> { 

                        vrListItems.forEach((vrItem) => {
                            if (vrItem.visitID == visitInfo.visitID) {
                                isAvailable = true;
                                vrListLinks = vrItem;
                                console.log(vrItem.visitID);
                            }
                        })
                    });

                    if (isAvailable) {
                        let vrDetails = LTMGR.getVisitReport(visitInfo.visitID);
                        await vrDetails.then((vrDetailsDic)=> { 
                            let popupBasicInfo = createPopupVisitReportView(vrDetailsDic, vrListLinks);          
                        });
                    } else {


                            let popupBasicInfo;
                            popupBasicInfo = 
                                `<div class="card card-bordered style-primary">
                                        <div class="card-head">
                                            <div class="tools">
                                                <div class="btn-group">
                                                    <a class="btn btn-icon-toggle btn-refresh"><i class="md md-refresh"></i></a>
                                                    <a class="btn btn-icon-toggle btn-collapse"><i class="fa fa-angle-down"></i></a>
                                                    <a class="btn btn-icon-toggle btn-close"><i class="md md-close"></i></a>
                                                </div>
                                            </div>
                                            <header class="">${visitInfo.service}</header>
                                            <h4 style="color:yellow;">VISIT REPORT HAS NOT BEEN SENT</h4>
                                            <div class="card-body p-t-0">
                                            </div>
                                        </div>
                                        <div class="card-body p-t-0">
                                            <p><span class="text-default">ARRIVED: ${visitInfo.arrived}
                                            &nbsp &nbsp COMPLETE: </span>${visitInfo.completed}</span></p>
                                            <p class="no-margin no-padding"><span class="text-default">SITTER: </span>${visitInfo.sitterName}</p>
                                            <p class="no-margin no-padding"><span class="text-default">CLIENT: ${visitInfo.clientName}</p>
                                        </div>
                                </div>`;

                                if (visitInfo.status == 'completed') {
                                    popupBasicInfo += '<div class=\"card\"><div class=\"card-header no-margin\"><p class=\"alert alert-success no-margin\"><i class=\"fa fa-compass\"> COMPLETE: </i> '+visitInfo.timeOfDay+'</p></div>';
                                } else if (visitInfo.status == 'late') {
                                    popupBasicInfo += '<div class=\"card\"><div class=\"card-header no-margin\"><p class=\"alert alert-warning no-margin\"><i class=\"fa fa-warning\"> LATE: </i> '+visitInfo.timeOfDay+'</p></div>';
                                } else if (visitInfo.status == 'future') {
                                    popupBasicInfo += '<div class=\"card\"><div class=\"card-header no-margin\"><p class=\"alert alert-info no-margin\"><i class=\"fa fa-wifi\"> FUTURE: </i> '+visitInfo.timeOfDay+'</p></div>';
                                } else if (visitInfo.status == 'canceled') {
                                    popupBasicInfo += '<div class=\"card\"><div class=\"card-header no-margin\"><p class=\"alert alert-danger no-margin\"><i class=\"fa fa-ban\"> CANCELED: </i> '+visitInfo.timeOfDay+'</p></div>';
                                }

                            popupBasicInfo += `
                                <div class=\"card-body small-padding p-t-0 p-b-0\">
                                    <div class=\"form-group floating-label m-t-0 p-t-0\">
                                        <textarea name=\"messageSitter\" id=\"messageSitter\" class=\"form-control text-sm\" rows=\"3\">
                                            ${visitInfo.visitNote}
                                        </textarea>
                                        <label for=\"messageSitter\">
                                            <i class=\"fa fa-note icon-tilt-alt\"></i> Visit Notes
                                        </label>
                                    </div>
                                    </p>
                                </div>
                                <div class="card-actionbar">
                                    <div class="card-actionbar-row no-padding">
                                        <a href="javascript:void(0);" class="btn btn-icon-toggle btn-danger ink-reaction pull-left">
                                        <i class="fa fa-heart"></i></a><a href="javascript:void(0);" class="btn btn-icon-toggle btn-default ink-reaction pull-left">
                                        <i class="fa fa-reply"></i></a><a href="javascript:void(0);" class="btn btn-flat btn-default-dark ink-reaction">SEND</a>
                                    </div>
                                </div>
                                </div>`;
                            popup.setHTML(popupBasicInfo);
                    }
                    popup.setHTML(popupBasicInfo);
                });
            }
        }
        function createPopupVisitReportView(vrDetails, vrListInfo) {

            let dateReport = vrListInfo.dateReport;
            let timeReport = vrListInfo.timeReport;
            let arrivedTime = vrDetails.ARRIVED;
            let completedTime = vrDetails.COMPLETED;

            let timeArrive = re.exec(arrivedTime);
            let arriveTime = timeArrive[1] + ':' + timeArrive[2];
            let timeComplete = re.exec(completedTime);
            let completeTime = timeComplete[1] + ':' + timeComplete[2];
            let moodKeys = Object.keys(vrDetails.MOODBUTTON);
            console.log(vrDetails.MOODBUTTON);
            let onMood = moodKeys.filter(function(key) {
                return vrDetails.MOODBUTTON[key] == 1;
            });

            popupBasicInfo = 
                `<div class="card card-bordered style-primary" id="popupMain">
                    <div class="card-head">
                        <div class="tools">
                            <div class="btn-group">
                                <a class="btn btn-icon-toggle btn-refresh"><i class="md md-refresh"></i></a>
                                <a class="btn btn-icon-toggle btn-collapse"><i class="fa fa-angle-down"></i></a>
                                <a class="btn btn-icon-toggle btn-close"><i class="md md-close"></i></a>
                            </div>
                        </div>
                        <header class="">${vrListInfo.service}</header>
                        <div>
                            ${onMood.map((mood)=>{
                                return "<img src=./assets/img/"+moodButtonMap[mood]+" width=36 height=36>"
                            })}
                        </div>
                        <div>
                            <span><img src=${vrDetails.VISITPHOTONUGGETURL} id="popupPhoto" width = 160 height = 160></span>
                            &nbsp&nbsp
                            <span><img src=${vrDetails.MAPROUTENUGGETURL} width = 160 height = 160></span>
                        </div>
                        <div class="card-body p-t-0">
                        </div>
                    </div>
                    <div class="card-body p-t-0">
                        <p><span class="text-default">ARRIVED: ${arriveTime}
                            &nbsp &nbsp COMPLETE: </span>${completeTime}</span></p>
                        <p class="no-margin no-padding"><span class="text-default">SITTER: </span>${vrListInfo.sitter}</p>
                        <p class="no-margin no-padding"><span class="text-default">CLIENT: ${vrDetails.CLIENTFNAME} ${vrDetails.CLIENTLNAME}</p>
                        <p class="no-margin no-padding"><span class="text-default">PETS: ${vrDetails.PETS}</p>

                    </div>
                </div>`;
            popupBasicInfo += '<div class=\"card\"><div class=\"card-header no-margin\"><p class=\"alert alert-success no-margin\"><i class=\"fa fa-compass\"> COMPLETE</i>';
            popupBasicInfo += '<p class=\"alert alert-success no-margin\">VISIT REPORT SENT:  '+ timeReport  +' <BR> ' + dateReport +'</p></div>';
            popupBasicInfo += `
                    <div class=\"card-body small-padding p-t-0 p-b-0\">
                        <div class=\"form-group floating-label m-t-0 p-t-0\">
                                        
                            <textarea name=\"messageSitter\" id=\"messageSitter\" class=\"form-control text-sm\" rows=\"3\">
                                \n\n${vrDetails.NOTE}
                            </textarea>
                            <label for=\"messageSitter\">
                                <i class=\"fa fa-note icon-tilt-alt\"></i> Visit Notes
                            </label>
                        </div>
                    </div>
                    <div class="card-actionbar">
                        <div class="card-actionbar-row no-padding">
                            <a href="javascript:void(0);" class="btn btn-icon-toggle btn-danger ink-reaction pull-left">
                            <i class="fa fa-heart"></i></a><a href="javascript:void(0);" class="btn btn-icon-toggle btn-default ink-reaction pull-left">
                            <i class="fa fa-reply"></i></a><a href="javascript:void(0);" class="btn btn-flat btn-default-dark ink-reaction">SEND</a>
                        </div>
                    </div>
            </div>`;
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
            onWhichDay = new Date(todayDate);
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
        function updateDateInfo() {

            let todayMonth = onWhichDay.getMonth() +1 ;
            let todayYear = onWhichDay.getFullYear();
            let todayDay = onWhichDay.getDate();
            let dayOfWeek = onWhichDay.getDay();
            console.log('Today month: ' + todayMonth + ' Year:' + todayYear + ' Today Day: ' + todayDay + ' Day of Week:' + dayOfWeek);

            /*let dayWeekLabel = document.getElementById('dayWeek');
            dayWeekLabel.innerHTML = dayArrStr[dayOfWeek] + ', ';
            let monthLabel = document.getElementById('month');
            monthLabel.innerHTML = monthsArrStr[todayMonth-1];
            let dateLabel = document.getElementById("dateLabel");
            dateLabel.innerHTML = todayDay;*/
        }
        function createSitterPopup(sitterInfo) {

            let popupBasicInfo = '<h1>'+sitterInfo.sitterName+'</h1>';
            popupBasicInfo += '<p>'+sitterInfo.street1 +',  ' + sitterInfo.city + '</p>';
            popupBasicInfo += '<p>Number of visits: </p>';
            popupBasicInfo += '<p><img src=\"./assets/img/postit\-20x20.png\" width=20 height=20>&nbsp&nbsp<input type=\"text\" name=\"messageSitter\" id=\"messageSitter\"></p>';

            return popupBasicInfo;
        }
        function createSitterPopupWithMileage(sitterInfo, mileageInfo, visitList) {

            let popupBasicInfo = '<h1>'+sitterInfo.sitterName+'</h1>';
            popupBasicInfo += '<p>'+sitterInfo.street1 +',  ' + sitterInfo.city + '</p>';
            let distanceResponse = mileageInfo.route;
            let waypoints = mileageInfo.waypoints;
            let total_distance = distanceResponse.distance/1000;
            let total_duration = distanceResponse.duration/60;
            let route_legs = distanceResponse.legs;
            let num_legs = distanceResponse.legs.length;
            let total_dist_check = 0;
            let total_duration_check= 0;
            let first_distance = 0;
            let last_distance =0;
            let first_duration = 0;
            let last_duration =0;
            let route_index = 0;
            route_legs.forEach((leg)=> {
                let step_arr = leg.steps;
                num_legs = num_legs - 1;
                route_index = route_index + 1;
                total_dist_check = total_dist_check + parseFloat(leg.distance);
                total_duration_check = total_duration_check + parseFloat(leg.duration);
                if (route_index == 0) {
                    first_distance = leg.distance;
                }
                if (route_index == distanceResponse.legs.length - 1) {
                    last_distance = leg.distance
                }
            });
            total_miles = total_miles + (total_distance * .62137);
            total_duration_all = total_duration_all + total_duration;
            total_distance = total_distance * .62137;
            let per_visit_distance = total_distance / (waypoints.length-2);
            let per_visit_duration = total_duration / (waypoints.length-2);
            popupBasicInfo += '<p style="color:white">Total Miles: ' + total_distance + '<BR>';
            popupBasicInfo += '<p style="color:white"> Duration: ' + total_duration + '<BR>';
            popupBasicInfo += '<p style="color:white">Number of visits: </p'+ visitList.length +'<BR>';
            popupBasicInfo += '<ul>';
            visitList.forEach((visit)=> {
                popupBasicInfo += '<li>' + visit.clientName;
                if(visit.sitterName == sitterInfo.sitterName) {
                    createMapMarker(visit, "");
                }
            })
            popupBasicInfo += '</ul>';

            popupBasicInfo += '<p><img src=\"./assets/img/postit\-20x20.png\" width=20 height=20>&nbsp&nbsp<input type=\"text\" name=\"messageSitter\" id=\"messageSitter\"></p>';

            return popupBasicInfo;
        }
        function createSitterMapMarkerWithMileage(sitterInfo, mileageInfo, visitList) {
            let el = document.createElement('div');
            let latitude = parseFloat(sitterInfo.sitterLat);
            let longitude = parseFloat(sitterInfo.sitterLon);
            let popupView;
            if (latitude != null && longitude != null && latitude < 90 && latitude > -90) {
                popupView = createSitterPopupWithMileage(sitterInfo, mileageInfo, visitList);
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
            visitList.forEach((visit) => {
                createMapMarker(visit, "");
            })
        }
        function createSitterMapMarker(sitterInfo) {
            let el = document.createElement('div');
            let latitude = parseFloat(sitterInfo.sitterLat);
            let longitude = parseFloat(sitterInfo.sitterLon);
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
        function showVisitBySitter(sitterProfile){

            removeVisitDivElements();
            removeAllMapMarkers();

            let sitterFilterButton = document.getElementById(sitterProfile.sitterID);

            if(showSitter[sitterProfile.sitterID]) {
                showSitter[sitterProfile.sitterID] = false;
                sitterFilterButton.setAttribute("style", "background-color: Tomato;")
            } else {
                showSitter[sitterProfile.sitterID] = true;
                sitterFilterButton.setAttribute("style", "background-color: DodgerBlue;")

            }

            let visitListBySitter = [];
            let currentVisitListBySitter = [];

            allVisits.forEach((visitDetails)=> {
                let sitterKeys = Object.keys(showSitter);
                sitterKeys.forEach((sitKey) => {
                    if (showSitter[sitKey] && visitDetails.sitterID == sitKey) {
                        visitListBySitter.push(visitDetails);
                        if (sitterProfile.sitterID  == visitDetails.sitterID) {     
                            currentVisitListBySitter.push(visitDetails);
                        }
                        createMapMarker(visitDetails,'marker');
                    }
                })
            });

            currentVisitListBySitter.sort(function(a,b){
                return new Date(a.completed) - new Date(b.completed);
            });

            visitListBySitter.forEach((visitDetails)=> {
                createVisitHTML(visitDetails);
            });

            let isMileageDone = false;

            trackSitterMileage.forEach((sitterDicts)=> { 
                if (sitterDicts.sitterID == sitterProfile.sitterID) {
                    isMileageDone = true;
                }
            });


            if(!isMileageDone){
                //console.log('CALCULATING SITTER MILEAGE');
                calculateRouteTimeDistance(sitterProfile.sitterID, currentVisitListBySitter);
            } else {
                console.log('MILEAGE ENTRY EXISTS')
            }

            let lastVisit = visitListBySitter[visitListBySitter.length -1]

            if (lastVisit.lon != null && lastVisit.lat != null && lastVisit.lon > -90 && lastVisit.lat < 90) {

               map.flyTo({
                    center: [parseFloat(lastVisit.lon), parseFloat(lastVisit.lat)],
                    zoom: 18
                });
            }
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
          
            let visitLabel = document.createElement("div");
            let visitDiv = document.getElementById("visitListByClient");   
            visitDiv.appendChild(visitLabel); 
            visitLabel.id = visitDetails.visitID;
            visitLabel.setAttribute("class", "tile-text");
            visitLabel.setAttribute("name", visitDetails.clientName);
            visitLabel.classList.add('alert','alert-callout');
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
        function showSitters() {
            total_miles = 0;
            total_duration_all =0;

            removeVisitDivElements();
            removeAllMapMarkers();
            let sitterProfile;

            allSitters.forEach((sitter)=> {
                let showSitterVisitList = [];
                let hasVisits = false;
                let sitterDistance; 

                allVisits.forEach((visit) => {
                    if (visit.sitterID == sitter.sitterID) {
                        trackSitterMileage.forEach((sitterMiles) => {
                            if (sitterMiles.sitterID == sitter.sitterID) {
                                hasVisits = true;
                                sitterDistance = sitterMiles;
                                showSitterVisitList.push(visit);
                            }
                        });
                    }
                });
                if (hasVisits) {
                    showSitterVisitList.forEach((visit) => {
                        console.log('Sitter visit: ' + visit.clientName);
                    });
                    createSitterMapMarkerWithMileage(sitter, sitterDistance, showSitterVisitList);
                }    
            })
        }
        function loginAjax(username, password, role, startdate, enddate) {

            let responseHeaders;
            let url = base_url+ 'mmd-login.php';

            fetch(url, {
                method : 'post',
                headers: {
                    "Content-type" : "application/x-www-form-urlencoded",
                    "User-Agent" : "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.1.2 Safari/605.1.15",
                },
                body: JSON.stringify({
                    user_name:username, 
                    user_pass:password, 
                    expected_role:role
                })
            })
            .then((response)=> {
                responseHeaders = response.headers; 
                cookieVal = responseHeaders['set-cookie'];
                console.log('Logged in with cookie: ' + cookieVal);
            })
        }
        function getSittersAjax() {
            let url = base_url+ '/mmd-sitters.php';
            fetch(url, {
                method : 'post',
                headers: {
                    "Content-type" : "application/x-www-form-urlencoded",
                    "User-Agent" : "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.1.2 Safari/605.1.15",
                    "Cookie" : cookieVal
                }
            })
                .then((response)=> {
                    return response.json();
                })
                .then((myJSON)=> {
                    console.log('SITTERS FETCH response' + myJSON);
                    let keys = Object.keys(myJSON);
                    myJSON.forEach((sitterProfile) => {
                        let nSitterProfile = new SitterProfile(sitterProfile);
                        allSitters.push(nSitterProfile);    
                    })

                    resolve('ok');
                })
                .then((loginOK) => {
                    console.log('SITTER DATA OK');
                });
        }
        function getVisitsAjax(startDate, endDate) {

            let listSitterID;

            allSitters.forEach((sitter) => {
                listSitterID += sitter.sitterID + ',';
            });

            let url = base_url+ '/mmd-visits.php';
            fetch(url, {
                method : 'post',
                body: {
                    'start' : startDate,
                    'end' : endDate,
                    'sitters' : listSitterID
                },
                headers: { 
                    "Content-type" : "application/x-www-form-urlencoded",
                    "User-Agent" : "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.1.2 Safari/605.1.15",
                    "Cookie" : cookieVal
                }
            })
            .then((response)=> {
                console.log('SITTERS FETCH response');
                return response.json();
            })
            .then((myJSON)=> {
                let keys = Object.keys(managerJSON);
                myJson.forEach((sitterProfile) => {
                    let nSitterProfile = new SitterProfile(sitterProfile);
                    sitterList.push(nSitterProfile);    
                })
                resolve('ok');
            })
            .then((loginOK) => {
                console.log('SITTER DATA OK');
            });
        }
        function getClientDataAjax() {

            let clientIDlist;
            visitList.forEach((visitItem)=> {
                console.log(visitItem.clientptr);
                clientIDlist += visitItem.clientptr + ',';
            })

            let url = base_url + 'mmd-clints.php';

            fetch(url, {
                method : 'post',
                body: {
                    'start' : startDate,
                    'end' : endDate,
                    'sitters' : listSitterID
                },
                headers: { 
                    "Content-type" : "application/x-www-form-urlencoded",
                    "User-Agent" : "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.1.2 Safari/605.1.15",
                    "Cookie" : cookieVal
                }
            })
            .then((response)=> {
                console.log('SITTERS FETCH response');
                return response.json();
            })
            .then((myJSON)=> {
                let keys = Object.keys(managerJSON);
                myJson.forEach((sitterProfile) => {
                    let nSitterProfile = new SitterProfile(sitterProfile);
                    sitterList.push(nSitterProfile);    
                })
                resolve('ok');
            })
            .then((loginOK) => {
                console.log('SITTER DATA OK');
            });            
        }
        function parseDistanceData(distanceResponse, waypoints, sitterID) {
            let sitterMileDict ={};
            sitterMileDict[sitterID] = distanceResponse;
            sitterMileDict['route'] = distanceResponse;
            sitterMileDict['waypoints'] = waypoints;
            sitterMileDict['sitterID'] = sitterID;
            trackSitterMileage.push(sitterMileDict);

            let total_distance = distanceResponse.distance/1000;
            let total_duration = distanceResponse.duration/60;
 
            let route_legs = distanceResponse.legs;
            let num_legs = distanceResponse.legs.length;
            let total_dist_check = 0;
            let total_duration_check= 0;
            let route_index = 0;

            LTMGR.addDistanceMatrixPair(distanceResponse, waypoints);

            route_legs.forEach((leg)=> {
                let step_arr = leg.steps;
                num_legs = num_legs - 1;
                route_index = route_index + 1;
                total_dist_check = total_dist_check + parseFloat(leg.distance);
                total_duration_check = total_duration_check + parseFloat(leg.duration);
            });

            total_miles = total_miles + (total_distance * .62137);
            total_duration_all = total_duration_all + total_duration;
            total_distance = total_distance * .62137;
            let per_visit_distance = total_distance / (waypoints.length-2);
            let per_visit_duration = total_duration / (waypoints.length-2);

            if (total_duration_all > 60) {
                let total_hr = parseInt(total_duration_all / 60);
                let mins_mod = parseInt(total_duration_all % 60);
                //console.log('TOTAL DURATION: ' + total_hr + ' hr ' + mins_mod + ' min');
            } else {
                //console.log('TOTAL DURATION: ' + total_duration_all);
            }
        }
        function calculateRouteTimeDistance(sitterID, sitterRoute) {

            let waypointsArr = [];

            sitterRoute.forEach((visit)=> {
                let lat = parseFloat(visit.lat);
                let lon = parseFloat(visit.lon);
                let coordPair = [];
                coordPair.push(lon);
                coordPair.push(lat);
                let coord = {"coordinates" : coordPair};
                let waypointName = {"name" : visit.clientName};
                waypointsArr.push(coord);
            });

            allSitters.forEach((sitter)=> {
                if(sitterID == sitter.sitterID) {

                    console.log('Sitter: ' + sitter.sitterName);
                    let lat = parseFloat(sitter.sitterLat);
                    let lon = parseFloat(sitter.sitterLon);
                    let coordPair = [];
                    coordPair.push(lon);
                    coordPair.push(lat);
                    let coord = {"coordinates" : coordPair};

                    if (lat != null && lon != null && lon > -90 && lat < 90) {
                        waypointsArr.push(coord);
                        waypointsArr.unshift(coord);
                        createSitterMapMarker(sitter);
                    } else {
                        console.log('sitter does not have valid coordinates');
                    }

                 }
            });

            let waypointDict= {"waypoints": waypointsArr};
            var mapboxClient = mapboxSdk({ accessToken: mapboxgl.accessToken });
            mapboxClient.directions.getDirections(waypointDict)
                .send()
                .then(response => {
                    const directions = response.body;
                    let waypoints = directions['waypoints'];
                    let routes = directions.routes;
                    let d2 = routes[0];
                    parseDistanceData(d2, waypoints,sitterID);
                }, error => {
                    console.log('Hit error');
                    console.log(error.message);
                });
        }




