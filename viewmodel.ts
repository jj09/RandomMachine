/// <reference path="assets/definitions/knockout.d.ts" />
/// <reference path="assets/definitions/jquery.d.ts" />
/// <reference path="model.ts" />

import Email = Model.Email;

class ViewModel {

  public emails: KnockoutObservableArray<Email>;

  public validEmails: KnockoutComputed<Array<Email>>;

  public uniqueEmails: KnockoutComputed<Array<Email>>;

  public showEmails: KnockoutObservable<boolean>;

  public shuffledPresent: KnockoutObservable<boolean>;

  public showShuffledEmails: KnockoutObservable<boolean>;

  public emailsToDrawCount: KnockoutObservable<number>;

  public selectedEmails: KnockoutObservableArray<Email>;

  public exportShuffled: KnockoutObservable<boolean>;

  private newLineDelimiter: String = "\n";

  // source: https://www.inkling.com/read/javascript-definitive-guide-david-flanagan-6th/chapter-22/reading-text-files-with
  public readFile (f: any): void {
    var reader = new FileReader();
    reader.readAsText(f);

    reader.onload = () => {
      var text = reader.result;
      var emailsTemp = text.split(this.newLineDelimiter);
      for(var i = 0; i<emailsTemp.length; ++i) {
      	this.emails.push(new Email(emailsTemp[i].replace("\r","")));
      }
    };

    reader.onerror = (e: any) => {
	  alert("Error", e);
	  console.log("Error", e);
    };
  }

  public shuffleEmails (): void {
  	for(var i = 0; i < this.emails().length; ++i) {
  	  var shuffled = this.shuffleString(this.emails()[i].email());
  	  this.emails()[i].shuffled(shuffled);
  	}

  	this.shuffledPresent(true);
  }

  public drawEmails (): void {
  	var copyOfEmails = this.uniqueEmails(),
  	    luckyNumber: number;

  	this.selectedEmails([]);

  	for(var i = 0; i<this.emailsToDrawCount(); ++i) {
  	  luckyNumber = Math.floor(Math.random() * copyOfEmails.length);
  	  this.selectedEmails.push(copyOfEmails[luckyNumber]);
  	  copyOfEmails.splice(luckyNumber, 1);
  	}
  }

  public exportResults (): void {
  	var result = [],
  		data,
  		textFile;

  	$("#downloadlink").attr("href", textFile).fadeOut(200);

  	for(var i = 0; i<this.selectedEmails().length; ++i) {
  	  if(this.exportShuffled()) {
  	    result.push(this.selectedEmails()[i].shuffled() + this.newLineDelimiter);
  	  } else {
  	  	result.push(this.selectedEmails()[i].email() + this.newLineDelimiter);
  	  }
  	}

  	data = new Blob(result);
  	textFile = window.URL.createObjectURL(data);	// source: http://jsfiddle.net/UselessCode/qm5AG/

  	$("#downloadlink").attr("href", textFile).fadeIn(200);
  }

  private validateEmail (email: string): boolean {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  private shuffleString (str: string): string {
  	var a = str.split(""),
        n = a.length;

    for(var i = n - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
    }

    return a.join("");
  }

  constructor() {
    var valid = [];

    this.emails = ko.observableArray([]);
    this.showEmails = ko.observable(false);
  	this.showShuffledEmails = ko.observable(false);
  	this.selectedEmails = ko.observableArray([]);
  	this.emailsToDrawCount = ko.observable(1);
  	this.shuffledPresent = ko.observable(false);
  	this.exportShuffled = ko.observable(false);

    this.validEmails = ko.computed(() => {

	  for(var i = 0; i < this.emails().length; ++i) {
	    if(this.validateEmail(this.emails()[i].email())) {
	  	  valid.push(this.emails()[i]);
	    }
	  }

	  return valid;
	});

    this.uniqueEmails = ko.computed(() => {
	  	var unique = [],
	  		temp = [];

	    for(var i = 0; i < this.validEmails().length; ++i) {
	      if(!temp[this.validEmails()[i].email()]) {
	      	temp[this.validEmails()[i].email()] = true;
	      	unique.push(this.validEmails()[i]);
	      }
	    }

	    return unique;
	  });
  }
}

ko.applyBindings(new ViewModel());