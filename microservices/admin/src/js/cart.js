const {ShowRequest, ShowResponse, AddRequest, RemoveRequest, Cart} = require('./protobuf/cart_pb.js');

const {CartAPIClient} = require('./protobuf/cart_grpc_web_pb.js');

export const order = new Vue({
  el: '#cart',
  data: {
    endpoint: window.location.protocol + '//' + window.location.host + "/cart",
    form: {
      userUUID: '',
      cartProducts: [],
    },
    resp: {
      cart: [],
      errorCode: 0,
      errorMsg: '',
    }
  },
  created: function() {
      this.client = new CartAPIClient(this.endpoint);
  },
  methods: {
    addCartProduct: function() {
      this.form.cartProducts.push({value:''});
    },
    clearForm: function() {
      this.form.userUUID = '';
      this.form.cartProducts = [];
    },
    clearResponseField: function() {
      this.resp.cart = [];
      this.resp.errorCode = 0;
      this.errorMsg = '';
    },
    showCart: function() {
      this.clearResponseField();
      const req = new ShowRequest();
      req.setUseruuid(this.form.Useruuid);
      this.client.show(req, {}, (err, resp) => {
        if (err) {
          this.resp.errorCode = err.code;
          this.resp.errorMsg = err.message;
        } else {
          let c = new Object();
          c.userUUID = resp.getCart().getUseruuid();
          c.cartProducts = resp.getCart().getCartproductsMap();
          this.resp.cart.push(c);
          this.resp.errorCode = err.code;
        }
      });
    },
    addCart: function() {
      this.clearResponseField();
      const req = new AddRequest();
      const c = new Cart();
      c.setUseruuid(this.form.userUUID);
      this.form.cartProducts.forEach(function(v) {
        c.getCartproductsMap().set(v.productUUID, v.count);
      });
      req.setCart(c);
      this.client.add(req, {}, (err, resp) => {
        if (err) {
          this.resp.errorCode = err.code;
          this.resp.errorMsg = err.message;
        } else {
          let c = new Object();
          c.Useruuid = resp.getUseruuid();
          this.resp.cart.push(c);
          this.resp.errorCode = err.code;
        }
      });
    },
    removeCart: function() {
      this.clearResponseField();
      const req = new RemoveRequest();
      const c = new Cart();
      c.setUseruuid(this.form.userUUID);
      this.form.cartProducts.forEach(function(v) {
        c.getCartproductsMap().set(v.productUUID, v.count);
      });
      req.setCart(c);
      this.client.remove(req, {}, (err, resp) => {
        if (err) {
          this.resp.errorCode = err.code;
          this.resp.errorMsg = err.message;
        } else {
          let c = new Object();
          c.Useruuid = resp.getUseruuid();
          this.resp.cart.push(c);
          this.resp.errorCode = err.code;
        }
      });
    },
  }
});
