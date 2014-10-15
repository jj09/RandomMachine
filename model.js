/// <reference path="assets/definitions/knockout.d.ts" />
var Model;
(function (Model) {
    var Email = (function () {
        function Email(email) {
            this.email = ko.observable(email);
            this.shuffled = ko.observable("");
        }
        return Email;
    })();
    Model.Email = Email;
})(Model || (Model = {}));
