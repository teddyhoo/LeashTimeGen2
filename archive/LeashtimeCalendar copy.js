(function (namespace, $) {
    "use strict";
        var petOwnerProfile;
        var startDateService;
        var endDateService;
        var currentTimeWindowBegin;
        var currentTimeWindowEnd;
        var currentServiceChosen;
        var surchargeItems =[];
        var serviceList = [];
        var timeWindowList =[];
        var all_visits = [];
        var currentPetsChosen = {};
        const  dayArrStr = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
        const monthsArrStr = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        var event_visits = [];

    var LeashtimeCal = function () {
        var o = this;
        var calendar;
        $(document).ready(function () {
            $.ajax({
                "url" : "http://localhost:3300",
                "type" : "GET",
                "data" : {"type" : "visits"},
                "dataTYPE" : "JSON"
            }).done((data)=> {
                $.ajax({
                    "url" : "http://localhost:3300",
                    "type" : "GET",
                    "data" : {"type" : "clients"},
                    "dataTYPE" : "JSON"
                }).done((clientdata)=>{
                    o.petOwnerProfile = LT.getClientProfileInfo(clientdata);
                    o.createEvents(data, petOwnerProfile);
                    o.initialize();
                 })
            })
            $.ajax({
                "url" : "http://localhost:3300",
                "type" : "GET",
                "data" : {
                    "type" : "mmdLogin", 
                    "username" : "dlifebri", 
                    "password" : "pass", 
                    "role" : "m"},
                "dataTYPE" : "JSON"
            }).done((data)=> {
                console.log(data);
            })
        });

    };
    var p = LeashtimeCal.prototype;
    p.initialize = function () {
        this._enableEvents();
        this._initEventslist();
        this._initCalendar();
        this._displayDate();
    };
    p._enableEvents = function () {
        var o = this;

        $('#calender-prev').on('click', function (e) {
            console.log('Calendar Prev clicked');
            o._handleCalendarPrevClick(e);
        });
        $('#calender-next').on('click', function (e) {
           console.log('Calendar Next clicked');
            o._handleCalendarNextClick(e);
        });
        $('.nav-tabs li').on('show.bs.tab', function (e) {
            console.log('Nav tabs clicked');
            o._handleCalendarMode(e);
        });

        $('#form-modal2').on('click', function(e) {
            console.log('Calendar Modal clicked');
            o._clickModal(e);
        });2
    };
    p._handleCalendarPrevClick = function (e) {
        $('#calendar').fullCalendar('prev');
        this._displayDate();
    };
    p._handleCalendarNextClick = function (e) {
        $('#calendar').fullCalendar('next');
        this._displayDate();
    };
    p._handleCalendarMode = function (e) {
        $('#calendar').fullCalendar('changeView', $(e.currentTarget).data('mode'));
    };
    p._displayDate = function () {
        var selectedDate = $('#calendar').fullCalendar('getDate');
        $('.selected-day').html(moment(selectedDate).format("dddd"));
        $('.selected-date').html(moment(selectedDate).format("DD MMMM YYYY"));
        $('.selected-year').html(moment(selectedDate).format("YYYY"));
    };
    p._clickDate = function () {
        var selectedDate = $('#calendar').fullCalendar('getDate');
        var visitDiv = $('#visitDiv')
            $('.selected-day').html(moment(selectedDate).format("dddd"));
            $('.selected-date').html(moment(selectedDate).format("DD MMMM YYYY"));
            $('.selected-year').html(moment(selectedDate).format("YYYY"));
    };
    p.processServiceRequest = function (event) {
            let invoice = document.getElementById('invoice');
            let pickedService = this.createTableServiceRow(invoice);
            if (endDateService != null) {
                let endDateObj = new Date(endDateService);
                let beginDateObj = new Date(startDateService);
                let monthEndDate = endDateObj.getMonth()+1;
                let monthBegDate = beginDateObj.getMonth()+1;
                let dateMonthEnd = endDateObj.getDate();
                let dateMonthBeg = beginDateObj.getDate();
                let momDateMonthEnd = moment([endDateObj.getFullYear(), monthEndDate, dateMonthEnd]);
                let momDateMonthBeg = moment([beginDateObj.getFullYear(), monthBegDate, dateMonthBeg]);
                let dayDiff = momDateMonthEnd.diff(momDateMonthBeg, 'days');
                console.log(dayDiff);
            }

            let monthDay = day_of_the_month(startDateService);
            let monthZero = month_zero(startDateService);
            let yearZero = startDateService.getFullYear();
            let cleanDate = new Date(yearZero + '-' + monthZero + '-' + monthDay + ' ' + currentTimeWindowBegin);
            let hoursZero = clean_hour(cleanDate);
            let minZero = clean_minute(cleanDate);
            let dateTimeBegin = yearZero + '-' + monthZero + '-' + monthDay + ' ' + hoursZero + ':' + minZero + ':00';
            let dateTimeBeginDate = new Date(dateTimeBegin);

            let cancelVisitRequestButton = document.getElementById('cancelServiceRequest');
            cancelVisitRequestButton.addEventListener('click', function() {
                if (invoice.hasChildNodes) {
                    while(invoice.firstChild) {
                        invoice.removeChild(invoice.firstChild);
                    }
                }
            });
            let sendVisitRequestButton = document.getElementById('sendVisitRequest')
            sendVisitRequestButton.addEventListener('click', function() {
                if (invoice.hasChildNodes) {
                    while(invoice.firstChild) {
                        invoice.removeChild(invoice.firstChild);
                    }
                }
                let event = {
                    id : dateTimeBegin,
                    title: pickedService,
                    start : dateTimeBeginDate,
                    end : dateTimeBeginDate,
                    color : 'orange',
                    status : 'pending',
                    sitter: 'unassigned',
                }
                $('#calendar').fullCalendar('renderEvent', event, true);
            });
            $('#formModal2').modal('show');
    };
    p.createEvents = function(eventData, petOwnerInfo) {
        all_visits = LT.getVisits(eventData);
        surchargeItems = LT.getSurchargeItems(eventData); 
        serviceList = LT.getServiceItems(eventData);
        timeWindowList = LT.getTimeWindows(eventData);
        populateServiceList(serviceList);
        makeServicePicker(serviceList, timeWindowList, petOwnerInfo);

        all_visits.forEach((visit) => {
            
            let eventTitle = visit.service;
            let eventStart = visit.time_window_start;
            let eventEnd = visit.time_window_end;
            let eventDateStart = visit.date + ' ' + eventStart;
            let eventDateEnd = visit.date + ' ' + eventEnd;
            let visitColor = '';
            let visitURL = '';
            if(visit.status == 'canceled') {
                visitColor = 'red';
            } else if (visit.status == 'completed') {
                visitColor = 'green';
                visitURL ='<LINK TO VISIT REPORT>';
            } else if (visit.status  == 'future' || visit.status == 'INCOMPLETE' || visit.status == 'incomplete') {
                visitColor = 'blue';
            } else if (visit.status == 'late') {
                visitColor = 'orange';
            } else if (visit.status == 'pending') {
                visitColor = 'orange';
            }

            let event = {
                id : visit.appointmentid,
                title: eventTitle,
                start : eventDateStart,
                end : eventDateEnd,
                color : visitColor,
                status : visit.status,
                sitter: visit.sitter
            };
            event_visits.push(event);
        });
    };
    p.choosePet=function(event, petID) {
            if(this.currentPetsChosen[petID] == 'on') {
                this.currentPetsChosen[petID] = 'off';
            } else  {
                this.currentPetsChosen[petID] = 'on';
            }
    };
    p._clickModal = function() {
        var selectedDate = $('#calendar').fullCalendar('getDate');
        console.log('Modal clicked');
    };
    p._initEventslist = function () {
        if (!$.isFunction($.fn.draggable)) {
            return;
        }
        var o = this;

        $('.list-events li ').each(function () {
            // create an Event Object
            // it doesn't need to have a start or end
            var eventObject = {
                title: $.trim($(this).text()), 
                className: $.trim($(this).data('className'))
            };

            $(this).data('eventObject', eventObject);
            $(this).draggable({
                zIndex: 999,
                revert: true, 
                revertDuration: 0, 
            });
        });
    };
    p._initCalendar = function (e) {
        if (!$.isFunction($.fn.fullCalendar)) {
            return;
        }
        var date = new Date();
        var d = date.getDate();
        var m = date.getMonth();
        var y = date.getFullYear();
        var o = this;
        
        calendar = $('#calendar').fullCalendar('getCalendar');
        calendar.fullCalendar({
            height: 700,
            header: false,
            selectable: true,
            events: event_visits,
            editable : true,

            select: function(start, end, jsEvent, view) {
                let monthString = getMonthString(start);
                let todayNum = getTodayNum(start);
                let todayStr = getTodayString(start);
                let dateElem = document.getElementById('dateToday');
                dateElem.innerHTML =  todayStr + ' ' +monthString + ' ' + todayNum;
                startDateService = new Date(start);
                endDateService = new Date(end);

                $('#formModal').modal('show');
                $('#calendar').fullCalendar("unselect");
            },

            eventClick:  function(event, jsEvent, view) {
                console.log('Event full calendar clicked: ' + event.status);
                let apptID = event.id;
                let startDate = moment(event.start)
                let dateString = startDate.date();
                let dayOfWeek = startDate.day();
                let monthStr= startDate.month();
                let startHour = startDate.hour();
                let startMin = startDate.minute();
                if (startMin == 0) {
                    startMin = '00';
                }

                let endDate = moment(event.end);
                let endHour = endDate.hour();
                let endMin = endDate.minute();
                if (endMin == 0) {
                    endMin = '00';
                }
                let apptStatus = event.status;

                let titleString = ' VISIT: ' + dayArrStr[dayOfWeek] + ', ' + monthsArrStr[monthStr] + '  '+ dateString +'   ' + event.title + ' (' + startHour + ':' + startMin + '-' + endHour + ':' + endMin + ')'; 

                let actionTitle = document.getElementById('scheduledVisitAction');
                let cancelAction = document.getElementById('cancelVisitButton');
                let changeButton = document.getElementById('changeServiceButton');
                let cancelChangeText = document.getElementById('cancelChangeText');
                all_visits.forEach((visit) => {

                    if (visit.appointmentid == event.id) {

                        if (visit.status == 'completed') {
                            actionTitle.innerHTML = titleString;
                            cancelAction.innerHTML = 'SEE VISIT REPORT';

                            $('#formModal2').modal('show');

                        } else if (visit.status == 'canceled') {
                            actionTitle.innerHTML = titleString;
                            cancelAction.innerHTML = 'UNCANCEL';
                            cancelAction.addEventListener('click', function() {
                                let cancelArray = [];
                                cancelArray.push(event.id);
                                uncancelVisit(cancelArray, cancelChangeText.value);
                            });

                            $('#formModal2').modal('show');

                        } else if (visit.status == 'future' || visit.status == 'late' || visit.status == 'INCOMPLETE' || visit.status == 'incomplete') {
                            actionTitle.innerHTML = titleString;
                            cancelAction.addEventListener('click', function() {
                                let cancelArray = [];
                                cancelArray.push(event.id);
                                cancelVisit(cancelArray, cancelChangeText.value);

                            });
                            $('#formModal2').modal('show');

                        } else if (visit.status == 'pending') {

                            $('#formModal2').modal('show');

                        }
                    }
                });
            },
            eventRender: function(event, element){
                console.log("render cal event");
                $(element).find(".fc-content").append("");

                var $calendar = $("#calendar").fullCalendar("getCalendar");

                 function remove_event(eventID){
                     var remove = confirm("Remove event ID " + eventID + "?");

                     if(remove == true){
                        calendar.fullCalendar("removeEvents", eventID);
                     }
                 }

                currentTimeWindowBegin = null;
                currentTimeWindowEnd = null;
                startDateService = null;
                endDateService = null;
                currentServiceChosen = null;
            },
            views: {
                basic: {
                  // options apply to basicWeek and basicDay views
                },
                agenda: {
                  // options apply to agendaWeek and agendaDay views
                },
                week: {
                  // options apply to basicWeek and agendaWeek views
                },
                day: {
                  // options apply to basicDay and agendaDay views
                }
            },

            viewRender: function(view, element) { 
                $("#calendar").fullCalendar( 'refresh' ) 
            },
            droppable: true,
            drop: function (date, allDay) { 
                var originalEventObject = $(this).data('eventObject');
                // we need to copy it, so that multiple events don't have a reference to the same object
                var copiedEventObject = $.extend({}, originalEventObject);

                // assign it the date that was reported
                copiedEventObject.start = date;
                copiedEventObject.allDay = allDay;
                copiedEventObject.className = originalEventObject.className;

                // render the event on the calendar
                // the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
                $('#calendar').fullCalendar('renderEvent', copiedEventObject, true);

                // is the "remove after drop" checkbox checked?
                if ($('#drop-remove').is(':checked')) {
                    // if so, remove the element from the "Draggable Events" list
                    $(this).remove();
                }
            },
        });
    };

    function makeServicePicker (serviceList, timeWindowList, petOwn) {

        console.log('making service picker');
        let servicePicker = document.getElementById('selectService');
        let timeWindowPicker = document.getElementById('timeWindowPicker');
        let todayDatePicker = document.getElementById('dateToday');
        let petPicker = document.getElementById('petPicker')
        let endDatePicker = document.getElementById('untilDate');
        let requestVisit = document.getElementById('requestServiceButton');
        let invoice = document.getElementById('invoice');

        if (endDateService != null) {
            let endDateObj = new Date(endDateService);
            let beginDateObj = new Date(startDateService);
            let monthEndDate = endDateObj.getMonth()+1;
            let monthBegDate = beginDateObj.getMonth()+1;
            let dateMonthEnd = endDateObj.getDate();
            let dateMonthBeg = beginDateObj.getDate();
            let momDateMonthEnd = moment([endDateObj.getFullYear(), monthEndDate, dateMonthEnd]);
            let momDateMonthBeg = moment([beginDateObj.getFullYear(), monthBegDate, dateMonthBeg]);
            let dayDiff = momDateMonthEnd.diff(momDateMonthBeg, 'days');
            console.log(dayDiff);
        }

        requestVisit.addEventListener('click', function(event) {
            console.log('SERVICE START DATE: ' + startDateService);
            let monthDay = dayMonth(startDateService);
            let monthZero = month_zero(startDateService);
            let yearZero = startDateService.getFullYear();
            let cleanDate = new Date(yearZero + '-' + monthZero + '-' + monthDay + ' ' + currentTimeWindowBegin);
            let hoursZero =clean_hour(cleanDate);
            let minZero = clean_minute(cleanDate);
            let dateTimeBegin = yearZero + '-' + monthZero + '-' + monthDay + ' ' + hoursZero + ':' + minZero + ':00';
            let dateTimeBeginDate = new Date(dateTimeBegin);
            let pickedService = createTableServiceRow(invoice);
            let cancelVisitRequestButton = document.getElementById('cancelServiceRequest');
            cancelVisitRequestButton.addEventListener('click', function() {
                if (invoice.hasChildNodes) {
                    while(invoice.firstChild) {
                        invoice.removeChild(invoice.firstChild);
                    }
                }
            });
            let sendVisitRequestButton = document.getElementById('sendVisitRequest')
            sendVisitRequestButton.addEventListener('click', function() {
                if (invoice.hasChildNodes) {
                    while(invoice.firstChild) {
                        invoice.removeChild(invoice.firstChild);
                    }
                }
            });

            let newEvent = {
                id : dateTimeBegin,
                title: pickedService,
                start : dateTimeBeginDate,
                end : dateTimeBeginDate,
                color : 'orange',
                status : 'pending',
                sitter: 'unassigned',
            }
            $('#calendar').fullCalendar('renderEvent', newEvent, true);
        });

        endDatePicker.innerHTML = 'End Date';
        endDatePicker.addEventListener('mouseleave', function(e) {
            endDateService = endDatePicker.value;
            if (endDateService != null) {
                endDateService = endDatePicker.value;
            }
            console.log(endDatePicker.value);
        });
        timeWindowList.forEach((tw)=> {
            let timeWindow = document.createElement('a');
            timeWindow.setAttribute('href', '#');
            timeWindow.setAttribute('class', 'btn btn-default-bright');
            timeWindow.setAttribute('type','checkbox');
            timeWindow.setAttribute('role', 'checkbox');
            timeWindow.addEventListener('click', function(event){
                event.preventDefault();
                currentTimeWindowBegin = tw.begin;
                currentTimeWindowEnd = tw.endTW;
            });
            timeWindow.innerHTML = tw.label;
            timeWindowPicker.appendChild(timeWindow)
        });
        serviceList.forEach((service) => {
            let serviceItem = document.createElement('a');
            let breakTag = document.createElement('br');
            serviceItem.setAttribute('href', '#');
            serviceItem.setAttribute('class','btn btn-default-bright');
            serviceItem.setAttribute('type','checkbox');
            serviceItem.setAttribute('role', 'checkbox');
            serviceItem.innerHTML = service.serviceName;
            servicePicker.appendChild(serviceItem);
            serviceItem.addEventListener('click', function(event){
                event.preventDefault();
                currentServiceChosen = service.serviceCode;
            });
        });
        /*petOwnerProfile.pets.forEach((pet)=> {
            let petInfo = document.createElement('a');
            let breakTag = document.createElement('br');
            petInfo.setAttribute('href','#');
            petInfo.setAttribute('class','btn btn-default-bright');
            petInfo.setAttribute('type','checkbox');
            petInfo.setAttribute('role', 'checkbox');
            petInfo.addEventListener('click', function(event) {
                console.log(pet.petName + ' -> ' + currentPetsChosen[pet.petID]);
                if(currentPetsChosen[pet.petID] == 'on') {
                    currentPetsChosen[pet.petID] = 'off';
                } else  {
                    currentPetsChosen[pet.petID] = 'on';
                }
                petInfo.innerHTML = pet.petName;
                petPicker.appendChild(petInfo);
            });
        });*/

        //$('#formModal2').modal('show');
    }
    function populateServiceList  (serviceListItems) {

        let serviceEl = document.getElementById('serviceList');

        serviceListItems.forEach((serviceItem)=> {
            let listEl = document.createElement('li');
            listEl.setAttribute('class','tile lightgrey ui-draggable ui-draggable-handle padding');
            listEl.setAttribute('data-class-name', 'event-info');  
            let divElTileContent = document.createElement('div');
            divElTileContent.setAttribute('class', 'tile-content');
            let divElTileText = document.createElement('div');
            divElTileText.setAttribute('class','tileText');
            divElTileText.setAttribute('id', serviceItem.serviceCode);
            divElTileText.innerHTML = serviceItem.serviceName;
            divElTileContent.appendChild(divElTileText);
            listEl.appendChild(divElTileContent);
            serviceEl.appendChild(listEl);
        });
    }
    function dayMonth(d) {

        return (d.getDate() < 10 ? '0' : '') + d.getDate();
    }
    function getTodayString (todayDate) {
        let clickDay = new Date(todayDate);
        let daysOfWeek = ['MON','TUE','WED','THU','FRI','SAT','SUN'];
        let dayWeek = daysOfWeek[clickDay.getDay()];            
        return dayWeek;
    };
    function getTodayNum (todayDate) {
        let clickDay = new Date(todayDate);
        return clickDay.getDate()+1;
    };
    function getMonthString  (todayDate) {
        let clickDate = new Date(todayDate);
        let months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        let monthString = months[clickDate.getMonth()];
        return monthString;
    };
    function clean_hour  (d) {

        return(d.getHours() < 10 ? '0' : '') + d.getHours();
    };
    function clean_minute  (d) {

        return(d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
    };
    function month_zero  (d) {

        let monthNum = d.getMonth() + 1;
        return (monthNum < 10 ? '0' : '') + monthNum;
    };
    function createTableServiceRow (invoiceTable) {
            let pickedService = '';
            let newRow = document.createElement('tr');
            let newDateRow = document.createElement('td');
            newDateRow.innerHTML = getMonthString(new Date(startDateService)) + ' ' + getTodayNum(new Date(startDateService));
            let newServiceRow = document.createElement('td');
            newServiceRow.setAttribute('class','text-center');
            let newChargeRow = document.createElement('td');
            newChargeRow.setAttribute('class','text-right');

            serviceList.forEach((service)=> {
                if (currentServiceChosen == service.serviceCode) {
                    newServiceRow.innerHTML = service.serviceName;
                    pickedService = service.serviceName;
                    newChargeRow.innerHTML = service.serviceCharge;
                }
            });

            let newTimeWindowRow = document.createElement('td');
            newTimeWindowRow.setAttribute('class','text-right');
            newTimeWindowRow.innerHTML = currentTimeWindowBegin + '-' + currentTimeWindowEnd;
            newRow.appendChild(newDateRow);
            newRow.appendChild(newServiceRow);
            newRow.appendChild(newTimeWindowRow);
            newRow.appendChild(newChargeRow);
            invoiceTable.appendChild(newRow);

            return pickedService;
    };
    var calendar = $('#calendar').fullCalendar('getCalendar');
    
    namespace.LeashtimeCal = new LeashtimeCal;

    //console.log(describe(LeashtimeCal));

}(this.materialadmin, jQuery)); // pass in (namespace, jQuery):
