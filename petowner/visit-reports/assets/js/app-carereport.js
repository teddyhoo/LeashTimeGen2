var visitDictionary = {

  "vrdate" : "2018-09-01",           //vrdate
  "starttime" : "09:00:00",             //starttime
  "endtime": "11:00:00",             //endtime
  "timeofday" : "9:00 am-11:00 am",     //timeofday
  "appointmentid" : "204594",               //appointmentid
  "providerptr" : "42",                   //providerptr
  "servicecode" : "1",                    //servicecode
  "endtime" : "end",
  "arrived" : "arrived",
  "completed" : "completed",
  "servicelabel" : "service label",
  "note" : "Very long and lengthy note",
  "businessname" : "Biz Name",
  "BIZEMAIL" : "biz@biz.com",
  "BIZHOMEPAGE" : "biz.homepage.com",


}
  /*"$32.00",               //charge
  "$33.50",               //adjustment
  "$10.50",               //rate
  "$2.00",                //bonus
  "ongoing",              //packagetype
  "completed",            //vrstatus
  "00:30",                //hours
  "0.500",                //formattedhours
  "9:07am",             //arrived
  "11:22am",             //completed
  "Dog Walk",             //servicelabel
  "1.58",                 //tax
  "DOG WALKIN BIZ",       //businessname
  "Dog Walk",             //clientservicelabel
  "B.M.",                 //sitter
  "dogslife69@yahoo.com", //BIZEMAIL
  "http://s179641890.onlinehome.us/test/dogslifehome.html", //BIZHOMEPAGE
  "703 555 1212",         //BIZPHONE
  "123 Main Street ",     //BIZADDRESS1
  "Vienna",               //BIZCITY
  "VA",                   //BIZSTATE
  "22180",                //BIZZIP
  "http://leashtime.com/login-page.php?bizid=3",  //BIZLOGINPAGE
  "45",                   //SITTERID
  "Carmelo",              //SITTER
  "Barone",               //ARRIVED
  "42",                   //COMPLETED
  "https://LeashTime.com/appointment-map.php?token=pslvp",    //MAPROUTEURL
  "https://LeashTime.com/appointment-photo.php?token=uoufd",  //PHOTOURL
  "We had a nice walk today. All went as expected, healthy happy and wise.", //NOTE
  "Amica",                 //PETS
  "Grooming Service",     //service01
  "Flea Treatment",       //service02
*/
var myVisitReport = VR$(visitDictionary);

  //Find all content data fields
  var pageItems = document.querySelectorAll(".vrd");
  
  for ( var i = 0; i < pageItems.length; i++ ) {
      var vrAttr = pageItems[i].dataset.vrdata;
      console.log('vrAttr '+vrAttr);
    
      var vrData = myVisitReport[vrAttr];
      console.log('vrData'+vrData);
    
      pageItems[i].innerHTML = vrData;
    }

//myVisitReport.setPhoto();
//myVisitReport.setMap();