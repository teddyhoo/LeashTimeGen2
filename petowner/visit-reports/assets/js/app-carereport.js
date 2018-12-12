var visitDictionary = {
        "BIZNAME": "Dog's Life",
        "BIZSHORTNAME": "Dog's Life",
        "BIZEMAIL": "dogslife69@yahoo.com",
        "BIZHOMEPAGE": "http://s179641890.onlinehome.us/test/dogslifehome.html",
        "BIZPHONE": "703 555 1212",
        "BIZADDRESS1": "123 Main Street",
        "BIZADDRESS2": "",
        "BIZCITY": "Vienna",
        "BIZSTATE": "VA",
        "BIZZIP": "22180",
        "BIZLOGINPAGE": "http://leashtime.com/login-page.php?bizid=3",
        "CLIENTID": "2025",
        "CLIENTFNAME": "Carly",
        "CLIENTLNAME": "Carolina",
        "SITTERID": "2",
        "SITTER": {
            "none": true
        },
        "ARRIVED": "2018-11-07 11:15:30",
        "COMPLETED": "2018-11-07 11:23:49",
        "MOODBUTTON": {
            "cat": "0",
            "happy": "1",
            "hungry": "0",
            "litter": "0",
            "pee": "1",
            "play": "0",
            "poo": "1",
            "sad": "0",
            "shy": "0",
            "sick": "0"
        },
        "MAPROUTEURL": "https://LeashTime.com/appointment-map.php?token=rcsvx",
        "MAPROUTENUGGETURL": "https://LeashTime.com/appointment-map.php?nugget=jtFZXCCTeOeZ4kGwLcoAMkzTdRrf%2BP95",
        "VISITPHOTOURL": "https://LeashTime.com/appointment-photo.php?token=xuqtd",
        "VISITPHOTONUGGETURL": "https://LeashTime.com/appointment-photo.php?nugget=jtFZXCCTeOeZ4kGwLcoAMkzTdRrf%2BP95",
        "NOTE": "Just a nice little trip around Capitol Hill. This is sample visit report with new template.",
        "PETS": "Lilly",
        "PETSENGLISH": "Lilly"
    }

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

myVisitReport.setPhoto();
myVisitReport.setMap();