var reg_name, reg_pass;
var Client = Backbone.Model.extend({
    defaults: {
        name: null,
        pwd: null
    },
    initialize: function () {
        console.log("initialize client");
    }
});
var ClientsCollection = Backbone.Collection.extend({
    model: Client,
    initialize: function () {
        console.log("initialize clients collection");
        this.bind("add", function (model) { console.log("Add", model.get('id'), model); });
        this.bind("remove", function (el) { console.log("Remove", el.get('id'), el); });
    }
});
var ClientView = Backbone.View.extend({
    //el: $("#divClient"), /* Utilisation de zepto pour lier ClientView au DOM */
    el: 'div.panel',
    template: _.template($('#loginTemplate').html()),
    initialize: function () {
        var that = this;
        this.listeClients = new ClientsCollection();
        this.listClients = new ClientsCollection();
        this.listeClients.bind("add", function (model) {
            that.addClientToList(model);
        });
        this.listClients.bind("add", function (model) {
            that.addLoginToList(model);
        });
        _.bindAll(this, 'render');

    },
    render: function() {
        this.$el.html(this.template());
    },
    events: {
        'click #cmdAddClient': 'cmdAddClient_Click',
        'click #login': 'login'
    },
    cmdAddClient_Click: function () {
        var tmpClient = new Client({
            name: $("#txtIdClient").val(),
            pwd: $("#txtNomClient").val(),
        });
        this.listeClients.add(tmpClient);
    },
    login: function () {
        var tmplogin = new Client({
            name: $("#txtIdClient").val(),
            pwd: $("#txtNomClient").val(),
        });
        this.listClients.add(tmplogin);
    },
    addClientToList: function (model) {
        reg_name = model.get('name');
        reg_pass = model.get('pwd');
        $("#listeClient").html("<font size=5 color=green>You are Successfully Registered, Now you can Login</font>");
    },
    addLoginToList: function (model) {  ;
        if (model.get('name') == reg_name && model.get('pwd') == reg_pass) {
            $("#divClient").html("<font size=4 color=blue>Login sucessfull</font>");
        }
        else {
            $("#listeClient").html("<font size=5 color=red>Failed Logged in, Retry</font>");
        }
    },

});

var addView = Backbone.View.extend({
    el: 'div.panel',
    template: _.template($('#testViewTemplate').html()),
    initialize: function () {
        console.log('initializing addView')
        _.bindAll(this,  'render');

    },
    events: {
        'submit form#frmAddContact': 'addContact'
    },
    render: function () {
        var self = this;
        this.$el.html(this.template());
    },
    addContact: function (event) {
        var full_name = $('#full_name').val(),
            email = $('#email').val(),
            phone = $('#phone').val(),
            address = $('#address').val(),
            id = $('#id').val();

        if (id === '') {
            var contactmodel = new AB.contactModel({
                full_name: full_name,
                email: email,
                phone: phone,
                address: address
            });
        } else {
            var contactmodel = new AB.contactModel({
                id: id,
                full_name: full_name,
                email: email,
                phone: phone,
                address: address
            });
        }
        contactmodel.save();
        return false;
    }
});

var contactModel = Backbone.Model.extend({
    sync: function (method, model, options) {
        if (method === 'create' || method === 'update') {
            return $.ajax({
                dataType: 'json',
                url: '../php/addNewContact.php',
                data: {
                    id: (this.get('id') || ''),
                    full_name: (this.get('full_name') || ''),
                    email: (this.get('email') || ''),
                    phone: (this.get('phone') || ''),
                    address: (this.get('address') || '')
                },
                success: function (data) {
                    // put your code after the contact is saved/updated.
                }
            });
        }
    }
});
;var Router = Backbone.Router.extend({
    routes: {
        'login': 'renderLogin',
        'addView': 'renderAddView'
    },
    clientView: new ClientView(),
    addView: new addView(),
    renderLogin: function() {
        console.log('going to call render on  : ', clientView);
        this.clientView.render();
    },

    renderAddView: function () {
        console.log('going to call render on  : ', addView);
        this.addView.render();
    },
});
