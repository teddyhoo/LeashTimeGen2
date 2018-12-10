;(function(global, $) {

  /*var VisitReport = function(vrdate,starttime,endtime,timeofday,appointmentid,providerptr,servicecode,charge,adjustment,rate,bonus,packagetype,vrstatus,hours,formattedhours,arrived,completed,servicelabel,tax,businessname,clientservicelabel,sitter,BIZEMAIL,BIZHOMEPAGE,BIZPHONE,BIZADDRESS1,BIZCITY,BIZSTATE,BIZZIP,BIZLOGINPAGE,SITTERID,SITTER,ARRIVED,COMPLETED,MAPROUTEURL,PHOTOURL,NOTE,PETS,service01,service02) {
    return new VisitReport.init(vrdate,starttime,endtime,timeofday,appointmentid,providerptr,servicecode,charge,adjustment,rate,bonus,packagetype,vrstatus,hours,formattedhours,arrived,completed,servicelabel,tax,businessname,clientservicelabel,sitter,BIZEMAIL,BIZHOMEPAGE,BIZPHONE,BIZADDRESS1,BIZCITY,BIZSTATE,BIZZIP,BIZLOGINPAGE,SITTERID,SITTER,ARRIVED,COMPLETED,MAPROUTEURL,PHOTOURL,NOTE,PETS,service01,service02);


  }*/
  var VisitReport = function(visitDictionary) {
      console.log(visitDictionary);
      return new VisitReport.init(visitDictionary);

  }

  //Privates
//  var currentStatus = ['complete','late', 'pending', 'canceled'];
  
  var statusMessages = {
      complete: 'Visit Complete',
      pending:  'Pending Confirmation',
      canceled: 'Service Canceled',
      late:     'Running Late'
  }
   var MOODBUTTON = { 
     cat : "0",
     happy : "1", 
     hungry : "0", 
     litter : "0", 
     pee : "1", 
     play : "0", 
     poo : "1", 
     sad : "0", 
     shy : "0", 
     sick : "0" 
   }
   
  VisitReport.prototype = {
    
    setStatus : function() {
      return statusMessages[this.vrStatus]
    },
    
    setSelector : function(sel) {
      document.getElementById(sel);
      return this
    },
    
    setPhoto : function() {
      var imgHolder = document.getElementById('imgHolder');
      imgHolder.style.backgroundImage = 'url("' + this.PHOTOURL + '")';
    },
    
    setMap : function() {
      document.getElementById('vrMap').setAttribute('src', this.MAPROUTEURL);
    },
    
    swapPhotoMap : function() {
      vrPhoto = this.PHOTOURL;
      vrMap = this.MAPROUTEURL;
      imgTracker = 'vrPhoto';
      imgHolder = document.getElementById('imgHolder');
       
      if(imgTracker == 'vrPhoto'){
         image.src='vrMap';
         image_tracker='vrMap';
       }
       else{
         image.src='vrPhoto.png';
         image_tracker='vrPhoto';
        }
      },
    
//    setStatusMessage : function(complete) {
//      var msg;
//      
//      if(complete){
//        this.statusMsg = setStatus();
//      } else {
//        this.statusMsg = 'Status Incomplete';
//      }
//      
//      if (console){
//        console.log(statusMsg);
//      }
//
//      return statusMessages.vrStatus;
//    },
//    
    log : function(){
      if (console){
        console.log(this.vrID+': '+setStatus[this.vrStatus]);
      }
      return this;
    },
    
    setNewStatusMessage: function(newStatus){
      this.vrstatus = newStatus;
      this.setStatusMessage();
      return this;
    
    },
    
    HTMLContent : function(selector, status){
      status = this.vrstatus;
//      if(!$) {throw 'jQuery not loaded';}
//      if(!selector){throw 'Missing jQuery Selector';}
      var msg;
      if(completed) {
        msg = this.statusMessages[completed];
        console.log('complete msg:'+setStatus(msg))
      } 
      if(late) {
        msg = this.statusMessages[late];
        console.log('late msg:'+setStatus(msg))
      } 
      if(pending) {
        msg = this.statusMessages[pending];
        console.log('pending msg:'+setStatus(msg))
      }
      if(canceled) {
        msg = this.statusMessages[canceled];
        console.log('canceled msg:'+setStatus(msg))
      }
      
      $(selector).html(msg);
      
      return msg;

    }
  };
  
  VisitReport.init = function(visitDictionary) {
    
    var self = this;

    this.vrdate = visitDictionary['vrdate'];
    this.starttime = visitDictionary['starttime'];
    this.businessname = visitDictionary['businessname'];
    self.endtime = visitDictionary['endtime'];
    //self.timeofday = visitDictionary['timeofday'];
    //self.appointmentid = visitDictionary['appointmentid'];
    //self.providerptr = visitDictionary['providerptr'];
    //self.servicecode = visitDictionary['servicecode'];
    //self.charge = visitDictionary['charge'];
    /*self.adjustment = adjustment || '';
    self.rate = rate || '';
    self.bonus = bonus || '';
    self.packagetype = packagetype || '';
    self.vrstatus = vrstatus || '';
    self.hours = hours || '';
    self.formattedhours = formattedhours || '';*/
    self.arrived = visitDictionary['arrived'];
    self.completed = visitDictionary['completed'];
    self.servicelabel = visitDictionary['servicelabel'];
    //self.tax = tax || '';
    //self.clientservicelabel = clientservicelabel || '';
    //self.sitter = sitter || '';
    self.BIZEMAIL = visitDictionary['BIZEMAIL'];
    self.BIZHOMEPAGE = visitDictionary['BIZHOMEPAGE'];
    self.BIZPHONE = visitDictionary['BIZPHONE'];
    self.BIZADDRESS1 = visitDictionary['BIZADDRESS1'];
    self.BIZCITY = visitDictionary['BIZCITY'];
    self.BIZSTATE = visitDictionary['BIZSTATE'];
    self.BIZZIP = visitDictionary['BIZZIP'];
    self.BIZLOGINPAGE = visitDictionary['BIZLOGINPAGE'];;
    //self.SITTERID = SITTERID || '';
    //self.SITTER = SITTER || '';
    //self.ARRIVED = ARRIVED || '';
    //self.COMPLETED = COMPLETED || '';
    //self.MAPROUTEURL = MAPROUTEURL || '';
    self.PHOTOURL = visitDictionary['PHOTOURL'];
    self.NOTE = visitDictionary['note'];
    self.PETS = visitDictionary['PETS'];
    //self.service01 = service01 || '';
    //self.service02 = service02 || '';
    
    self.statusMsg =  self.setStatus()
  }
  
  VisitReport.init.prototype = VisitReport.prototype;
  
  global.VisitReport = global.VR$ = VisitReport;
    
}(window, jQuery));