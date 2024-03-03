var UserViewModel = function () {
    var self = this;
    self.username = ko.observable();
    self.password = ko.observable();
}

var LoginViewModel = function () {
    var self = this;
    self.user = new UserViewModel();

    self.signInBtn = async function () {
        var user = {
            username: self.user.username(),
            password: self.user.password()
        };
    
        try {
            await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            })
            .then(async function(response) {
                if (!response.ok) {
                    alert('Incorrect Username and/or Password');
                    return;
                }
                var fetchedData = await response.json();
                console.log(fetchedData);
                
                localStorage.setItem("data", JSON.stringify(fetchedData));
                window.location.href = "http://127.0.0.1:5500/Index.html";
            })
            .catch(function(error) {
                console.error('Something went wrong with fetch!', error);
                throw error;
            });
        } catch (error) {
            console.error('Something went wrong with fetch!', error);
            throw error;
        }
    }   
    
    self.signUpBtn = function() {
        window.location.href = "http://127.0.0.1:5500/Register.html";
    }
    

    self.activate = function () {
        var element = $('#login_container')[0];
        ko.cleanNode(element);
        ko.applyBindings(self, element);
    };
}

var loginViewModel;
$(document).ready(function () {
    loginViewModel = new LoginViewModel();
    loginViewModel.activate();
});