$.fn.serializeObject = function () {
  var o = {};
  var a = this.serializeArray();
  $.each(a, function () {
    if (o[this.name] !== undefined) {
      if (!o[this.name].push) {
        o[this.name] = [o[this.name]];
      }
      o[this.name].push(this.value || '');
    } else {
      o[this.name] = this.value || '';
    }
  });
  return o;
};

var Users = Backbone.Collection.extend({
  url: '/users'
});

var User = Backbone.Model.extend({
  urlRoot: '/users'
});

var UserList = Backbone.View.extend({
  el: '.page',
  render: function () {
    var that = this;
    var users = new Users();
    users.fetch({
      success: function (users) {
        var template = _.template($('#user-list-template').html(), {users: users.models});
        that.$el.html(template);
      }
    });
  }
});

var NewUser = Backbone.View.extend({
  el: '.page',
  render: function () {
    var template = _.template($('#new-user-template').html());
    this.$el.html(template);
  },
  events: {
    'submit .new-user-form': 'createUser'
  },
  createUser: function (ev) {
    var userDetails = $(ev.currentTarget).serializeObject();
    var user = new User();
    user.save(userDetails, {
      success: function (user) {
        router.navigate('', { trigger: true });
      }
    });
    return false;
  }
});

var Router = Backbone.Router.extend({
  routes: {
    '': 'home',
    'new': 'newUser'
  }
});

var userList = new UserList();
var newUser = new NewUser();

var router = new Router();
router.on('route:home', function () {
  userList.render();
});
router.on('route:newUser', function () {
  newUser.render();
});
Backbone.history.start();
