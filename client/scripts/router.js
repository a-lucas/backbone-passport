'use strict';


var Router = Backbone.Router.extend({
    routes: {
        'login': 'renderLogin',
        'denied': 'renderDenied',
        'feed': 'renderFeed'
    },
    loginView: new LoginView(),
    deniedView: new DeniedView(),
    menuView: new MenuView(),
    renderLogin: function() {
        this.loginView.render();
        this.menuView.render(this.isUserLoggedIn());
    },

    renderDenied: function () {
        this.deniedView.render();
        this.menuView.render(this.isUserLoggedIn());
    },

    renderFeed: function () {
        if ( window.user && window.user.roles) {
            if (_.includes( window.user.roles, 'admin' )) {
                try {
                    var feedView = new FeedView('admin');
                    feedView.render()
                } catch (e) {
                    console.error(e);
                }

            } else if (_.includes( window.user.roles, 'user' )) {
                try {
                    var feedView = new FeedView('user');
                    feedView.render()
                }
                catch (e) {
                    console.error(e);
                }

            }
        }
        this.menuView.render(this.isUserLoggedIn());
    },
    isUserLoggedIn: function() {
        return window.user && window.user.displayName;
    },
    execute: function(callback, args) {

        if ( window.location.hash === '#feed' && !this.isUserLoggedIn() ) {
            this.navigate('/login', true);
            return;
        }

        if (callback) callback.apply(this, args);
    }
});

$.ajaxSetup({
    statusCode: {
        401: function(){
            // Redirec the to the login page.
            window.location.replace('/#login');

        },
        403: function() {
            // 403 -- Access denied
            window.location.replace('/#denied');
        }
    }
});