var data = {
    "categories": [
      {
        "name": "Phones",
        "products": [
          {
            "name": "iPhone 12",
            "price": 999,
            "image": "./styles/images/cell.jpg"
          },
          {
            "name": "Samsung Galaxy S21",
            "price": 899,
            "image": "./styles/images/cell.jpg"
          },
          {
            "name": "Google Pixel 5",
            "price": 699,
            "image": "./styles/images/cell.jpg"
          }
        ]
      },
      {
        "name": "TVs",
        "products": [
          {
            "name": "LG OLED55CXPUA",
            "price": 1499,
            "image": "./styles/images/xbox.jpg"
          },
          {
            "name": "Samsung QN55Q80TAFXZA",
            "price": 1299,
            "image": "./styles/images/controller.jpg"
          },
          {
            "name": "Sony XBR-55A9G",
            "price": 1799,
            "image": "./styles/images/cell.jpg"
          }
        ]
      },
      {
        "name": "Consoles",
        "products": [
          {
            "name": "PlayStation 5",
            "price": 499,
            "image": "./styles/images/controller.jpg"
          },
          {
            "name": "Xbox Series X",
            "price": 499,
            "image": "./styles/images/xbox.jpg"
          },
          {
            "name": "Nintendo Switch",
            "price": 299,
            "image": "./styles/images/controller.jpg"
          }
        ]
      }
    ]
  };

var formatPrice = function(myPrice) {
return myPrice ? myPrice.toFixed(2) + "€" : "0.00€";
} 

var UserViewModel = function () {
    var self = this;
    self.username = ko.observable();
    self.password = ko.observable();
}

var Product = function(name, price, image) {
    var self = this;
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
    self.productData = data;
    self.selectedCategory = ko.observable('All Products');

    self.Categories = ko.observableArray();
    self.savedProducts = ko.observableArray([]);
    self.searchBar = ko.observable("");
    self.existingProduct = ko.observable(false);
    
    self.productData.categories.forEach(category => {
        self.Categories.push(category.name);
    });

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
                var product = new Product(productData.name, productData.price, productData.image);
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

  // ==================================== CART BUTTON ====================================
  self.displaySidePanel = ko.observable(false);
  self.displaySavedProductsBtn = function () {
    //debugger;
    self.displaySidePanel(!self.displaySidePanel());
  };

  self.emptyCart = ko.computed(function () {
    if (self.savedProducts().length === 0) {
      return true;
    }
    else {
      return false;
    }
  });

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

var mainViewModel;
$(document).ready(function () {
    mainViewModel = new MainViewModel(data);
    mainViewModel.activate();
});