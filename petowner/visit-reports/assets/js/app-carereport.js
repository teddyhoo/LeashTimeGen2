    /*var visitDictionary = {
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
    }*/

var myVisitReport;
var visitDictionary = 
    {
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
        "CLIENTID": "45",
        "CLIENTFNAME": "Carmelo",
        "CLIENTLNAME": "Barone",
        "SITTERID": "42",
        "SITTER": {
            "none": true
        },
        "ARRIVED": "2018-12-15 13:42:34",
        "COMPLETED": "2018-12-15 13:43:40",
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
        "MAPROUTEURL": "https://LeashTime.com/appointment-map.php?token=bduwwq",
        "MAPROUTENUGGETURL": "https://LeashTime.com/appointment-map.php?nugget=jtFZXCCTeOc9Gg8kjrD5f3B%2FwQepDaUN",
        "VISITPHOTOURL": "https://LeashTime.com/appointment-photo.php?token=vgozb",
        "VISITPHOTONUGGETURL": "https://LeashTime.com/appointment-photo.php?nugget=jtFZXCCTeOc9Gg8kjrD5f3B%2FwQepDaUN",
        "NOTE": "What a test visit report this is",
        "PETS": [
            "Amica"
        ],
        "PETSENGLISH": "Amica"
    };

    //getVisitReport('209158');

    


    function getVisitReport(visitID) {
        let url = 'https://leashtime.com/visit-report-data.php?id='+visitID;

        if (visitID == '209158') {

            var myVisitReport = VR$(visitDictionary);
            var pageItems = document.querySelectorAll(".vrd");
  
            for ( var i = 0; i < pageItems.length; i++ ) {
            var vrAttr = pageItems[i].dataset.vrdata;
            var vrData = myVisitReport[vrAttr];    
            pageItems[i].innerHTML = vrData;
            }

            myVisitReport.setPhoto();
            myVisitReport.setMap();
             
        } else {

            fetch(url)
            .then((response)=> {
                return response.json();
            })
            .then((visitReportJSON) => {
                var visitDictionary = JSON.stringify(visitReportJSON);
                var myVisitReport = VR$(visitDictionary);
                var pageItems = document.querySelectorAll(".vrd");
              
                for ( var i = 0; i < pageItems.length; i++ ) {
                  var vrAttr = pageItems[i].dataset.vrdata;
                  var vrData = myVisitReport[vrAttr];    
                  pageItems[i].innerHTML = vrData;
                }

                myVisitReport.setPhoto();
                myVisitReport.setMap();

            })
        }
    }

    
    

