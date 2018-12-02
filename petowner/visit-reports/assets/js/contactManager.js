class Visit {
constructor(vID, service, date) {
    this.vID = vID;
    this.service = service;
    this.date = new Date(date);
    }
}

class VisitManager {
    constructor() {
        // when we build the contact manager, it
        // has an empty list of contacts
        this.listOfVisits = [];
    }
    add(visit) {
        this.listOfVisits.push(visit);

    }
    remove(visit) {
        // we iterate on the list of contacts until we find the contact
        // passed as a parameter (we say that they are equal if emails match)
        for(let i = 0; i < this.listOfVisits.length; i++) {
        var v = this.listOfVisits[i];

        if(v.email === visit.email) {
            // remove the contact at index i
            this.listOfVisits.splice(i, i);
            // stop/exit the loop
            break;
        }
    };
    }

    printVisitsToConsole() {
        this.listOfVisits.forEach(function(v) {
            console.log(v.vID+" | "+v.service+" | "+v.date);
        });
    };
}

var vm = new VisitManager();
var v1 = new Visit("0001", "30MIN Walk", "2015-12-05T11:00:00-11:30");
var v2 = new Visit("0002", "30MIN Walk", "2015-03-12T12:00:00-02:30");
var v3 = new Visit("0003", "30MIN Walk", "2015-07-11T05:00:00-06:30");
var v4 = new Visit("0004", "OVERNIGHT", "2015-03-25T12:00:00-08:30");

console.log("--- Adding 4 contacts ---")
vm.add(v1);
vm.add(v2);
vm.add(v3);
vm.add(v4);

vm.printVisitsToConsole();
