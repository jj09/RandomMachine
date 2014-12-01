/// <reference path="assets/definitions/knockout.d.ts" />
/// <reference path="assets/definitions/jquery.d.ts" />
/// <reference path="model.ts" />
var Email = Model.Email;

var ViewModel = (function () {
    function ViewModel() {
        var _this = this;
        this.newLineDelimiter = "\n";
        this.emails = ko.observableArray([]);
        this.showEmails = ko.observable(false);
        this.showShuffledEmails = ko.observable(false);
        this.selectedEmails = ko.observableArray([]);
        this.emailsToDrawCount = ko.observable(1);
        this.shuffledPresent = ko.observable(false);
        this.exportShuffled = ko.observable(false);

        this.validEmails = ko.computed(function () {
            var valid = [], temp = [];
            for (var i = 0; i < _this.emails().length; ++i) {
                if (_this.validateEmail(_this.emails()[i].email())) {
                    valid.push(_this.emails()[i]);
                }
            }

            return valid;
        });

        this.uniqueEmails = ko.computed(function () {
            var unique = [], temp = new Array();

            for (var i = 0; i < _this.validEmails().length; ++i) {
                if (!temp[_this.validEmails()[i].email()]) {
                    temp[_this.validEmails()[i].email()] = true;
                    unique.push(_this.validEmails()[i]);
                }
            }

            return unique;
        });
    }
    // source: https://www.inkling.com/read/javascript-definitive-guide-david-flanagan-6th/chapter-22/reading-text-files-with
    ViewModel.prototype.readFile = function (f) {
        var _this = this;
        var reader = new FileReader();
        reader.readAsText(f);

        reader.onload = function () {
            var text = reader.result;
            var emailsTemp = text.split(_this.newLineDelimiter);
            for (var i = 0; i < emailsTemp.length; ++i) {
                _this.emails.push(new Email(emailsTemp[i].replace("\r", "")));
            }
        };

        reader.onerror = function (e) {
            alert("Error", e);
            console.log("Error", e);
        };
    };

    ViewModel.prototype.shuffleEmails = function () {
        for (var i = 0; i < this.emails().length; ++i) {
            var shuffled = this.shuffleString(this.emails()[i].email());
            this.emails()[i].shuffled(shuffled);
        }

        this.shuffledPresent(true);
    };

    ViewModel.prototype.drawEmails = function () {
        var copyOfEmails = this.uniqueEmails(), luckyNumber;

        this.selectedEmails([]);

        for (var i = 0; i < this.emailsToDrawCount(); ++i) {
            luckyNumber = Math.floor(Math.random() * copyOfEmails.length);
            this.selectedEmails.push(copyOfEmails[luckyNumber]);
            copyOfEmails.splice(luckyNumber, 1);
        }
    };

    ViewModel.prototype.exportResults = function () {
        var result = [], data, textFile;

        $("#downloadlink").attr("href", textFile).fadeOut(200);

        for (var i = 0; i < this.selectedEmails().length; ++i) {
            if (this.exportShuffled()) {
                result.push(this.selectedEmails()[i].shuffled() + this.newLineDelimiter);
            } else {
                result.push(this.selectedEmails()[i].email() + this.newLineDelimiter);
            }
        }

        data = new Blob(result);
        textFile = window.URL.createObjectURL(data); // source: http://jsfiddle.net/UselessCode/qm5AG/

        $("#downloadlink").attr("href", textFile).fadeIn(200);
    };

    ViewModel.prototype.validateEmail = function (email) {
        var re = /\S+@\S+\.\S+/;
        return re.test(email);
    };

    ViewModel.prototype.shuffleString = function (str) {
        var a = str.split(""), n = a.length;

        for (var i = n - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var tmp = a[i];
            a[i] = a[j];
            a[j] = tmp;
        }

        return a.join("");
    };
    return ViewModel;
})();

ko.applyBindings(new ViewModel());
