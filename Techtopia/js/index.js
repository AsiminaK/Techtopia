var formatPrice = function(myPrice) {
return myPrice ? myPrice.toFixed(2) + "€" : "0.00€";
} 

var UserViewModel = function () {
    var self = this;
    self.UserId = ko.observable(null);
    self.Username = ko.observable(null);
    self.Orders = ko.observableArray(null);
}

var Product = function(id, name, price, image) {
    var self = this;
    self.id = id;
    self.name = name;
    self.price = price;
    self.image = image;
}

var SavedProduct = function(product , onProductDeleting) {
    var self = this;
    self.product = product;
    self.productQuantity = ko.observable(1);
    self.disableInputQuantity = true;
    self.onProductDeleting = onProductDeleting;
    self.SubtotalPrice = ko.computed(function () {
      var finalPrice = (self.productQuantity() * self.product.price);
      return finalPrice;
    });
  
    // ==================================== CHANGE THE QUANTITY VALUE ===================================
    self.subtractQuantity = function () {
      if (self.productQuantity() > 0) {
        var generalQuantity = self.productQuantity() - 1
        if (generalQuantity === 0) {
          var text = "You are going to delete this product from your cart!";
          if (confirm(text) == true) {
            
            
            if(self.onProductDeleting!=null)
            {
              self.onProductDeleting(self);
            }
            //vm.deleteProduct(self);
          }
          else {
            generalQuantity += 1;
          }
        }
        return self.productQuantity(generalQuantity);
      }
      else {
        return self.productQuantity();
      }
    }
  
    self.addQuantity = function () {
      if (self.productQuantity() < 10) {
        var generalQuantity = self.productQuantity() + 1
       self.productQuantity(generalQuantity);
      }
      else {
        //return self.productQuantity();
      }
    }
  }
  
  
var MainViewModel = function (data) {
    var self = this;
    self.isActive = ko.observable(false);
    self.user = new UserViewModel();
    self.productData = data.products;
    self.ordersData = data.orders;
    self.selectedCategory = ko.observable('All Products');

    self.savedProducts = ko.observableArray([]);
    self.searchBar = ko.observable("");
    self.existingProduct = ko.observable(false);

    self.dataReceived = JSON.parse(localStorage.getItem("data"));
    self.user.UserId(self.dataReceived?.userId);
    self.user.Username(self.dataReceived?.username);
    self.user.Orders(self.dataReceived?.orders);

    self.ordersVisible = ko.observable(false);
    self.orderDetails = ko.observable();

    self.Categories = ko.computed(function () {
        var retVal = [];
        
        if (!retVal.includes('All Products')) {
            retVal.push('All Products');
        }

        self.productData.categories.forEach(category => {
            retVal.push(category.name);
        });

        return retVal;
    }, this);


    self.chooseCategory = function(categoryName) {
        console.log(categoryName);
        self.selectedCategory(categoryName);
        if (self.existingProduct()) {
            self.searchBar("");
        }
    }    

    self.Products = ko.computed(function () {
        var selectedCategory = self.selectedCategory();
        var searching = self.searchBar().toLowerCase();

        var retVal = [];
        self.productData.categories.forEach((category) => {
          if (selectedCategory === undefined || selectedCategory === category.name || selectedCategory === "All Products") {
            category.products.forEach(function (productData) {
              self.existingProduct(false);
              if (
                searching === "" ||
                productData.name.toLowerCase().includes(searching)
              ) {
                var product = new Product(productData.productId, productData.name, productData.price, productData.image);
                product.imageText = "Alt text";
                product.category = category.name;
                retVal.push(product);
                self.existingProduct(false);
              }
              else if (searching !== "" &&
              productData.name.toLowerCase().includes(searching) === false) {
                self.existingProduct(true);
              }
            });
          }
        });

        return retVal;
    }, this);

     // =========================================== IS IN CART ==========================================
  self.isInCart = function (product) {
    var inCart = ko.utils.arrayFirst(self.savedProducts(), function (item) {
      return item.product.name === product.name;
    });
    //Check if is undefined and make it null
    if (inCart === undefined) {
      //return inCart = null;
      return null;
    }
    else {
      return inCart;
    }
  };

  // =========================================== ADD TO CART ==========================================
  //Save the current product in an array when button 
  self.addToCart = function (product) {
    // self.savedProducts.push(product);
    self.savedProducts.push(new SavedProduct(product, self.deleteProduct));
  };


  // =================================== DELETE PRODUCT FROM CART ==================================
  //deletion
  self.deleteProduct = function (product) { self.savedProducts.remove(product) };

  // ==================================== FIND TOTAL PRICE ==================================
  self.totalPrice = ko.pureComputed(function () {
    var total = 0;
    $.each(self.savedProducts(), function () { total += this.SubtotalPrice() })
    return total;
  });

  // ==================================== USER PANEL ====================================
  self.displayUserSidePanel = ko.observable(false);
  self.displaySidePanel = ko.observable(false);

  self.displayUserDataBtn = function () {
    self.displayUserSidePanel(!self.displayUserSidePanel());
    if (self.displayUserSidePanel()) {
      self.displaySidePanel(false);
    }
  };

  self.logoutBtn = function() {
    localStorage.removeItem("data");
    self.user = new UserViewModel();
  }

  self.loginBtn = function() {
    window.location.href = "http://127.0.0.1:5500/Login.html";
  }

  self.registerBtn = function() {
    window.location.href = "http://127.0.0.1:5500/Register.html"
  }

  self.showMyOrders = function() {
    self.ordersVisible(!self.ordersVisible());
  }

  self.getOrderName = function(orderId) {
    var order = self.ordersData.orders.find(o => o.orderId == orderId);
    if (order) {
      return order.orderDate;
    }
    else {
      return ''
    }
  }

  self.orderDetailsBtn = function(orderId) {
    var myOrders = self.ordersData.orders.filter(order => order.userId === self.user.UserId());

    var myOrder = myOrders.find(function(order) {
      return order.orderId === orderId;
    });
    
    self.orderDetails(myOrder ? myOrder : null)
  }

  self.getProductName = function(productId) {
    for (let category of self.productData.categories) {
      let product = category.products.find(p => p.productId === productId);
      if (product) {
        return product.name;
      }
    }
    return '';
  }
  

  // ==================================== CART BUTTON ====================================
  self.displaySavedProductsBtn = function () {
    self.displaySidePanel(!self.displaySidePanel());
    if (self.displaySidePanel()) {
      self.displayUserSidePanel(false);
    }
  };

  self.emptyCart = ko.computed(function () {
    if (self.savedProducts().length === 0) {
      return true;
    }
    else {
      return false;
    }
  });

  self.saveOrderBtn = async function () {
    var filteredArray = ko.toJS(self.savedProducts()).map(item => ({
      productId: item.product.id,
      productQuantity: item.productQuantity
    }));

    var order = {
        userId: self.user.UserId(),
        products: filteredArray,
        orderDate: moment().format('M/D/YYYY'),
        pricePaid: self.totalPrice(),
    };
    
    try {
        await fetch('http://localhost:3000/submitOrder', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(order)
        })
        .then(async function(response) {
            if (!response.ok) {
                alert('Order Failed');
                return;
            }
            alert('Order submitted succesfully!');
            var fetchedData = await response.json();
            console.log(fetchedData);
            
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


  // Observable to track the state of the off-canvas panel
  self.isOffcanvasOpen = ko.observable(false);

  // Function to toggle the off-canvas panel
  self.toggleOffcanvas = function() {
      self.isOffcanvasOpen(!self.isOffcanvasOpen());
  };

    self.activate = function () {
        var element = $('#main_container')[0];
        // TO DO: remove cleanNode
        ko.cleanNode(element);
        ko.applyBindings(self, element);
    };
}

async function fetchData() {
  try {
    const response = await fetch('http://localhost:3000/data');
    if (!response.ok) {
      throw new Error('Something went wrong!');
    }
    const data = await response.json();
    return data;
  }
  catch (error) {
    console.error('Something went wrong with fetch!', error);
    throw error;
  }
}

var mainViewModel;
$(document).ready(async function () {
    try {
        var fetchedDataResult = await fetchData();
        mainViewModel = new MainViewModel(fetchedDataResult);
        mainViewModel.activate(); 
        console.log(fetchedDataResult);
    } catch (error) {
        console.error('Error during document ready:', error);
    }
});