var UserViewModel = function () {
    var self = this;
    self.username = ko.observable();
    self.password = ko.observable();
}

var LoginViewModel = function () {
    var self = this;
    self.user = new UserViewModel();

    self.signInBtn = function () {
        debugger;
        console.log(ko.mapping.toJS(self.user)); 
    }

    self.activate = function () {
        var element = $('#login_container')[0];
        // TO DO: remove cleanNode
        ko.cleanNode(element);
        ko.applyBindings(self, element);
    };
}

var loginViewModel;
$(document).ready(function () {
    loginViewModel = new LoginViewModel();
    loginViewModel.activate();
});