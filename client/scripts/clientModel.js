'use strict';

var reg_name, reg_pass;

var RSS = Backbone.Model.extend({
    defaults: {
        title: null,
        link: null,
        author: null
    },
    initialize: function () {
        console.log("initialize RSS Model");
    }
})



var RSSCollection = Backbone.Collection.extend({
    model: RSS,
    url: function() {
        if (this.role === 'admin') {
            return '/adminFeeds';
        } else if (this.role === 'user') {
            return '/userFeeds';
        }
        throw 'pb'
    },
    initialize: function (role) {
        console.log('RSS COllection initialized');
        this.role = role;
        this.state = 'loading';
        this.on('request', function() {
            this.state = 'loading';
        }, this);
        this.on('sync', function() {
            this.state = 'ready';
            console.log('ready', this.toJSON());
        }, this);
    }
});

var MenuView = Backbone.View.extend({
    el: 'div.menu',
    template: _.template($('#menuViewTemplate').html()),
    initialize: function () {
        _.bindAll(this,  'render');

    },
    render: function (loggedIn) {
        this.loggedIn = loggedIn;
        this.$el.html(this.template());
        this.afterRender();
        return this;
    },
    afterRender: function(){
        if (this.loggedIn) {
            $("#login").hide();
            $("#logout").show();
            $("#userFeeds").show();
            $("#adminFeeds").show();
        } else {
            $("#login").show();
            $("#logout").hide();
            $("#userFeeds").hide();
            $("#adminFeeds").hide();
        }
        return this;
    }
});


var LoginView = Backbone.View.extend({
    el: 'div.panel',
    template: _.template($('#loginViewTemplate').html()),
    initialize: function () {
        _.bindAll(this,  'render');
    },
    render: function () {
        this.$el.html(this.template());
    },
});

var DeniedView = Backbone.View.extend({
    el: 'div.panel',
    template: _.template($('#deniedViewTemplate').html()),
    initialize: function () {
        _.bindAll(this,  'render');

    },
    render: function () {
        this.$el.html(this.template());
    },
});

var FeedView = Backbone.View.extend({
    el: 'div.panel',
    template: _.template($('#feedViewTemplate').html()),
    initialize: function ( role) {
        _.bindAll(this,  'render')
        this.rss = new RSSCollection( role );

    },
    render: function () {
        var that = this;
        this.rss.fetch({
            reset: true,
            success: function(){
                console.log('rssList = ', that.rss.toJSON());
                that.$el.html(that.template(
                    {
                        name: window.user.displayName,
                        facebookId: window.user.id,
                        rssList: that.rss.toJSON()
                    }));
            },
            error: function(err){
                console.error(err);
            }
        });
    },
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


