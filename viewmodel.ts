var viewModel = (function (){
  
  var Email = function (email) {
  	this.email = ko.observable(email);
  	this.shuffled = ko.observable("");
  }

  var emails = ko.observableArray([]);

  // source: https://www.inkling.com/read/javascript-definitive-guide-david-flanagan-6th/chapter-22/reading-text-files-with
  var readFile = function (f) {
    var reader = new FileReader();
    reader.readAsText(f);
    reader.onload = function() {
      var text = reader.result;
      var emailsTemp = text.split("\n");
      for(var i = 0; i<emailsTemp.length; ++i) {
      	emails.push(new Email(emailsTemp[i]));
      }
    }
    reader.onerror = function(e) {
	  alert("Error", e);
	  console.log("Error", e);
    };
  };

  var validateEmail = function (email) { 
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  var validEmails = ko.computed(function () {
  	var valid = [],
  		temp = [];

    for(var i = 0; i < emails().length; ++i) {
      if(validateEmail(emails()[i].email())) {
      	valid.push(emails()[i]);
      }
    }

    return valid;
  });

  var uniqueEmails = ko.computed(function () {
  	var unique = [],
  		temp = [];

    for(var i = 0; i < validEmails().length; ++i) {
      if(!temp[validEmails()[i].email()]) {
      	temp[validEmails()[i].email()] = true;
      	unique.push(validEmails()[i]);
      }
    }

    return unique;
  });

  

  

  var showEmails = ko.observable(false);

  var showShuffledEmails = ko.observable(false);

  var shuffleEmails = function () {
  	for(var i = 0; i < emails().length; ++i) {
  	  var shuffled = shuffleString(emails()[i].email());
  	  emails()[i].shuffled(shuffled);
  	}
  	this.shuffledPresent(true);
  };

  var shuffleString = function (str) {
  	var a = str.split(""),
        n = a.length;

    for(var i = n - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
    }

    return a.join("");
  };

  var selectedEmails = ko.observableArray([]);

  var emailsToDrawCount = ko.observable(1);

  var drawEmails = function () {
  	var copyOfEmails = this.uniqueEmails(),
  	    luckyNumber;

  	selectedEmails = ko.observableArray([]);
  	for(var i = 0; i<this.emailsToDrawCount(); ++i) {
  	  luckyNumber = Math.floor(Math.random() * copyOfEmails.length);
  	  this.selectedEmails.push(copyOfEmails[luckyNumber]);
  	  copyOfEmails.splice(luckyNumber, 1);
  	}
  };

  var shuffledPresent = ko.observable(false);

  var exportShuffled = ko.observable(false);

  var exportResults = function () {
  	// http://jsfiddle.net/UselessCode/qm5AG/
  };

  return {
  	readFile: readFile,
  	emails: emails,
  	uniqueEmails: uniqueEmails,
  	showEmails: showEmails,
  	validEmails: validEmails, 	
  	shuffleEmails: shuffleEmails,
  	showShuffledEmails: showShuffledEmails,
  	emailsToDrawCount: emailsToDrawCount,
  	drawEmails: drawEmails,
  	selectedEmails: selectedEmails,
  	shuffledPresent: shuffledPresent,
  	exportShuffled: exportShuffled,
  	exportResults: exportResults
  }
})();

ko.applyBindings(viewModel);