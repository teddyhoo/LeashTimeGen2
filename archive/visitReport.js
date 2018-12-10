class VisitReport {
    constructor(vrID, vrName) {
    this.vrID = "ID";
    this.vrName = "Name";
    }
}

var vr1 = new VisitReport("00001", "30MIN WALK");
var vr2 = new VisitReport("00002", "1HR WALK");

class VRManager {
    constructor(VisitReport) {
        // when we build the contact manager, it
        // has an empty list of contacts
        this.listOfReports = [];
    }
    add(VisitReport) {
        this.listOfReports.push(VisitReport);
    }
    remove(VisitReport) {
        // we iterate on the list of contacts until we find the contact
        // passed as a parameter (we say that they are equal if emails match)
        for(let i = 0; i < this.listOfReports.length; i++) {
            var r = this.listOfReports[i];

            if(r.vrID === VisitReport.vrName) {
                // remove the contact at index i
                this.listOfReports.splice(i, i);
                // stop/exit the loop
                break;
            }
        };
    }
    printReportsToConsole() {
        this.listOfReports.forEach(function(r) {
            console.log("<div>" + r.vrID + ":" + r.vrName + "</div>");
        });
    };
}

var vrm = new VRManager();
var vr1 = new VisitReport("0001", "j1HR WALK");
var vr2 = new VisitReport("0002", "30MIN WALK");
var vr3 = new VisitReport("0003", "30MIN WALK");
var vr4 = new VisitReport("0004", "OVERNIGHT");

console.log("--- Adding 4 contacts ---")
vrm.add(vr1);
vrm.add(vr2);
vrm.add(vr3);
vrm.add(vr4);

vrm.printReportsToConsole();
