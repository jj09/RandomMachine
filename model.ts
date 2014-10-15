/// <reference path="assets/definitions/knockout.d.ts" />

module Model {
  export class Email {
    public email: KnockoutObservable<string>;
    public shuffled: KnockoutObservable<string>;

    constructor(email: string) {
  	  this.email = ko.observable(email);
  	  this.shuffled = ko.observable("");
    }
  }
}