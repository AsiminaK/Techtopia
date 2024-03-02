var NewUserViewModel = function () {
    var self = this;
    self.Firstname = ko.observable();
    self.Lastname = ko.observable();
    self.Username = ko.observable();
    self.Email = ko.observable();
    self.Password = ko.observable();
    self.Address = ko.observable();
    self.City = ko.observable();
    self.Zip = ko.observable();
}

var RegisterViewModel = function () {
    var self = this;
    self.newUser = new NewUserViewModel();

    self.signUpBtn = async function () {
        var user = {
            username: self.newUser.Username(),
            password: self.newUser.Password(),
            firstname: self.newUser.Firstname(),
            lastname: self.newUser.Lastname(),
            email: self.newUser.Email(),
            address: self.newUser.Address(),
            city: self.newUser.City(),
            zip: self.newUser.Zip()
        };
        
        try {
            await fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            })
            .then(async function(response) {
                if (!response.ok) {
                    alert('Registration Failed');
                    return;
                }
                var fetchedData = await response.json();
                console.log(fetchedData);
                
                localStorage.setItem("data", JSON.stringify(fetchedData));
                window.location.href = "http://127.0.0.1:5501/Index.html";
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
    

    self.activate = function () {
        var element = $('#register_container')[0];
        ko.cleanNode(element);
        ko.applyBindings(self, element);
    };
}

var registerViewModel;
$(document).ready(function () {
    registerViewModel = new RegisterViewModel();
    registerViewModel.activate();
});