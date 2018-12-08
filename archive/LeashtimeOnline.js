(function (namespace, $) {
	"use strict";

	var LeashtimeVisit = function () {
		// Create reference to this instance
		var o = this;
		// Initialize app when document is ready
		$(document).ready(function () {
			o.initialize();
		});

	};
	var p = LeashtimeVisit.prototype;

	// =========================================================================
	// INITIALIZE PROTOTYPE
	// =========================================================================

	p.initialize = function () {
		this._enableEvents();
		this._initEventslist();
		//this._initCalendar();
		//this._displayDate();
    this._initVisitReport();
	};
    
    
  // =========================================================================
	// PRIVATE EVENTS - logged in
	// =========================================================================  
    
	// =========================================================================
	// PUBLIC EVENTS - not logged in
	// =========================================================================

	// events
	p._enableEvents = function () {
		var o = this;
		$('#calender-prev').on('click', function (e) {
			o._handleCalendarPrevClick(e);
		});
		$('#calender-next').on('click', function (e) {
			o._handleCalendarNextClick(e);
		});
		$('.nav-tabs li').on('show.bs.tab', function (e) {
			o._handleCalendarMode(e);
		});
    $('#calendar').on('click', function (e) {
			o._clickDate(e);
        console.log(o)
		});  
	};  

	// =========================================================================
	// CONTROLBAR
	// =========================================================================

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
  p._loadVR_JSON = function () {};
  p._initVisitReport = function () {};
  p._initPetProtect = function () {};
  p._initPetHealth = function () {};
    
  var li = createElement('li');
  ul.append(li); // adds the new li to the ul element
    
    
    function add() {
  // get the current value of the input field
  var val = document.querySelector('#newNumber').value;
  if((val !== undefined) && (val !== "")) {
    // val exists and non empty
    // get the list of numbers. It's a <ul>
    var ul = document.querySelector("#numbers");
    // add it to the list as a new <li>
    var newNumber = document.createElement("li");
    newNumber.textContent = val;
    // or newNumber.innerHTML = val
    ul.append(newNumber);
  }
}
 
function reset() {
  // get the list of numbers. It's a <ul>
  var ul = document.querySelector("#numbers");
  // reset it: no children
  ul.innerHTML = ""; 
}
    
    
    
	// =========================================================================
	// TASKLIST
	// =========================================================================

	p._initEventslist = function () {
		if (!$.isFunction($.fn.draggable)) {
			return;
		}
		var o = this;
    ///LEASHTIME SERVICES LIST FOR DRAGnDROP
		$('.list-events li ').each(function () {
			// create an Event Object
			// it doesn't need to have a start or end
			var eventObject = {
				title: $.trim($(this).text()), // use the element's text as the event title
				className: $.trim($(this).data('className'))
			};

			// store the Event Object in the DOM element so we can get to it later
			$(this).data('eventObject', eventObject);

			// make the event draggable using jQuery UI
			$(this).draggable({
				zIndex: 999,
				revert: true, // will cause the event to go back to its original place
				revertDuration: 0, //  original position after the drag
			});
		});
	};
    
    
// =========================================================================
// =========================================================================
// CALENDAR START
// =========================================================================
// =========================================================================
p._initCalendar = function (e) {
		if (!$.isFunction($.fn.fullCalendar)) {
			return;
		}
		var date = new Date();
		var d = date.getDate();
		var m = date.getMonth();
		var y = date.getFullYear();
    var calendar = $('#calendar').fullCalendar('getCalendar');
		calendar.fullCalendar({
			// Start of calendar OPTIONS
      height: 700,
			header: false,

//////////SELECT
    // Make possible to respond to clicks and selections
    selectable: true,
    

// This is the callback that will be triggered when a selection is made.
// It gets start and end date/time as part of its arguments
    select: function(start, end, jsEvent, view) {
        // Ask for a title. If empty it will default to "New event"
        var title = prompt("Enter a title for this event", "New event");
            console.log(title)
        // If did not pressed Cancel button
        if (title != null) {
            // Create event
            var event = {
                title: title.trim() != "" ? title : "New event",
                start: start,
                end: end
                };
                // Push event into fullCalendar's array of events
                // and displays it. The last argument is the
                // "stick" value. If set to true the event
                // will "stick" even after you move to other
                // year, month, day or week.
                calendar.fullCalendar("renderEvent", event, true);
        };
        // Whatever happens, unselect selection
        calendar.fullCalendar("unselect");
      }, // End select callback

//////////EDIT
// Make events editable, globally
        editable : true,
    
// Callback triggered when we click on an event
    eventClick: function(event, jsEvent, view){

        // Ask for a title. If empty it will default to "New event"
        var newTitle = prompt("Enter a new title for this event", event.title);

        // If did not pressed Cancel button
        if (newTitle != null) {
        // Update event
        event.title = newTitle.trim() != "" ? newTitle : event.title;
        // Call the "updateEvent" method
        calendar.fullCalendar("updateEvent", event);
        }
      }, // End callback eventClick   
        
        // Callback triggered just before an event is rendered
        eventRender: function(event, element){
            $(element).find(".fc-content").append("<div style='float:right'><a class='delete-link' href='javascript:remove_event(\""
                    + event._id + "\")'>Delete</a></div>");
            // Removes event with ID eventID from calendar
        
            // Global instance of the calendar to be used in other scripts.
             var $calendar = $("#calendar").fullCalendar("getCalendar");
            
             // Removes event with ID eventID from calendar
             function remove_event(eventID){
             var remove = confirm("Remove event ID " + eventID + "?");
            
             if(remove == true){
             calendar.fullCalendar("removeEvents", eventID);
             }
             }
        },
                 
                        
    
/////////VISIT EVENTS ON CALENDAR
			events: [
				{
					title: '30MIN DOGWALK',
					start: new Date(y, m, d + 1, 19, 0),
					end: new Date(y, m, d + 1, 22, 30),
					allDay: false
				},
        {
					title: '60MIN DOGWALK',
					start: new Date(y, m, d + 2, 19, 0),
					end: new Date(y, m, d + 4, 22, 30),
					allDay: false
				},
        {
					title: '30MIN DOGWALK',
					start: new Date(y, m, d + 11, 19, 0),
					end: new Date(y, m, d + 11, 22, 30),
					allDay: false
				}
          {
					title: '',
					start: new Date(y, m, d + 11, 19, 0),
					end: new Date(y, m, d + 11, 22, 30),
					allDay: false
				}
			],
			eventRender: function (event, element) {
				element.find('#date-title').html(element.find('span.fc-event-title').text());
			},
        
//////// VIEWS
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
      
///////DROP
      droppable: true,
			drop: function (date, allDay) { // this function is called when something is dropped
				// retrieve the dropped element's stored Event Object
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

	// =========================================================================
    
    // a convenient utility for getting the calendar object.
    // you can call methods on the calendar object directly.
    var calendar = $('#calendar').fullCalendar('getCalendar');

    calendar.on('dayClick', function(date, jsEvent, view) {
    console.log('clicked on ' + date.format());
    });    
    
    
	namespace.LeashtimeVisit = new LeashtimeVisit;
    
}
 (this.materialadmin, jQuery)); // pass in (namespace, jQuery):
