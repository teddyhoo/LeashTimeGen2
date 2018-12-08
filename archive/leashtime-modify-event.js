// Create calendar when document is ready
 $(document).ready(function() {
 // We will refer to $calendar in future code
 var $calendar = $("#calendar").fullCalendar({
 // Start of calendar options
 header: {
 left: 'prevYear,nextYear',
 center: 'title',
 right: 'today,month,agendaDay,agendaWeek prev,next'
 },

 // Make possible to respond to clicks and selections
 selectable: true,

 // This is the callback that will be triggered when a selection is made.
 // It gets start and end date/time as part of its arguments
 select: function(start, end, allDay) {

 // Set title from the description or use default if description empty
 var title = $('#eventDescription').val().trim() != "" ? $('#eventDes\
 cription').val(): "Appointment";

 // Description shows dates and times. Needs to be adjusted
 // depending on the current calendar view.
 // We will do that later.

 $('#eventDescription').html("<b>" + start.format("dddd, MMMM Do YYYY\
 ") + " from " + start.format("hh:mm a") + " to " + end.format("hh:mm a") + "</b>\
 ");
 // Attach start and end data to dialog `data` payload
 // so we can use them inside the dialog code

 $('#calCreateEventDialog').data({ 'start':start, 'end':end });

 // Set dialog title dynamically, according to selected dates
 // and times.

 $('#calCreateEventDialog').dialog({title: "Event: " + title});

 // Open dialog

 $('#calCreateEventDialog').dialog('open');

 }, // End select callback


 } // End of calendar options
 );

 });

 // Global instance of the calendar to be used in other scripts.
 var $calendar = $("#calendar").fullCalendar("getCalendar");

 // Create Event Dialog JavaScript **************************************
 $('#calCreateEventDialog').dialog({
 resizable: false,
 autoOpen: false,
 modal: true,
 width: 500,
 buttons: {
 Create: function() {

 // Get start and end dates from data payload

 var start = $(this).data('start');
 var end = $(this).data('end');
 var eventTitle = $("#eventTitle").val().trim();

 // Build event
 var event = {
 title: eventTitle != "" ? eventTitle: "Appointment",
 color: 'DeepSkyBlue',
 textColor: 'black',
 start: start.format(),
 end: end.format()
 }

 // Save event locally in fullCalendar's event array

 $calendar.fullCalendar('renderEvent', event
 , true // make the event "stick"?
 );

 // Unselect event. Selection trail will disappear.

 $calendar.fullCalendar('unselect');

 // Close dialog
 $(this).dialog('close');

 },

 Cancel: function() {
 $(this).dialog('close');
 }
 }
 });