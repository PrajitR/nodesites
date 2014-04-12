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
    'submit #new-user-form': 'createUser'
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

var EditUser = Backbone.View.extend({
  el: '.page',
  render: function (options) {
    var that = this;
    that.user = new User({ id: options.id });
    that.user.fetch({
      success: function (user) {
        var template = _.template($('#edit-user-template').html(), { user: user.attributes[0] });
        that.$el.html(template);
      }
    });
  },
  events: {
    'submit #edit-user-form': 'editUser',
    'click #delete-button': 'deleteUser'
  },
  editUser: function (ev) {
    var userDetails = $(ev.currentTarget).serializeObject();
    var user = new User();
    user.save(userDetails, {
      success: function (user) {
        router.navigate('', { trigger: true });
      }
    });
    return false;
  },

  deleteUser: function (ev) {
    this.user.destroy({
      success: function () {
        router.navigate('', { trigger: true });
      }
    });
  }
});

var Router = Backbone.Router.extend({
  routes: {
    '': 'home',
    'new': 'newUser',
    'edit/:id': 'editUser'
  }
});

var userList = new UserList();
var newUser = new NewUser();
var editUser = new EditUser();

var router = new Router();
router.on('route:home', function () {
  userList.render();
});
router.on('route:newUser', function () {
  newUser.render();
});
router.on('route:editUser', function (id) {
  editUser.render({ id : id });
});
Backbone.history.start();
