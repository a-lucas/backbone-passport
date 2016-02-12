'use strict';

var adminPolicy = require('./../config/policies'),
    request = require('request'),
    passport = require('passport'),
    FacebookStrategy = require('passport-facebook'),
    GithubStrategy = require('passport-github2'),
    config = require('./../config/config'),
    express = require('express');

function getRole(user) {

    switch (user.provider) {
        case 'facebook':
            return ['user'];
        case 'github':
            return ['admin'];
    }
}

// Passport session setup.
passport.serializeUser(function(user, done) {
    //simulate access to databdse to retrive roles
    user = Object.assign(user, {
        roles: getRole(user)
    });
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

passport.use(new FacebookStrategy({
        clientID: config.facebook.clientID,
        clientSecret: config.facebook.clientSecret,
        callbackURL: config.facebook.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
        process.nextTick(function () {
            return done(null, profile);
        });
    }
));


passport.use(new GithubStrategy({
        clientID: config.github.clientID,
        clientSecret: config.github.clientSecret,
        callbackURL: config.github.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
        process.nextTick(function () {
            return done(null, profile);
        });
    }
));

module.exports.init = function(app) {

    //serve the correct static paths for this application
    app.use('/scripts', express.static('client/scripts'));
    app.use('/img', express.static('client/img'));
    app.use('/bower_components', express.static('client/bower_components'));


    //Server side rendering
    app.route('/index').get(
        adminPolicy.isAllowed,
        function (req, res, next) {
            res.render('index', {user: req.user ? req.user : null});
        }
    );

    app.route('/logout').get(
        adminPolicy.isAllowed,
        function (req, res) {
            var name =  req.user ? req.user.displayName : '';
            console.log("LOGGIN OUT " + name);
            req.logout();
            res.redirect('/index#login');
            req.session.notice = "You have successfully been logged out " + name + "!";
        }
    );

    app.route('/userFeeds').get(adminPolicy.isAllowed, function (req, res) {
        var url = 'https://ajax.googleapis.com/ajax/services/feed/load?v=2.0&q=http://makezine.com/category/craft/feed/';
        request(url, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                console.log(body);
                var rss = JSON.parse(body);
                console.log(rss);
                res.send(JSON.stringify(rss.responseData.feed.entries));
            } else {
                console.error('An error happened ' + url);
            }
        });
    } );


    app.route('/adminFeeds').get(adminPolicy.isAllowed, function (req, res) {
        var url = 'https://ajax.googleapis.com/ajax/services/feed/load?v=2.0&q=http://makezine.com/category/craft/feed/';
        request(url, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                console.log(body);
                var rss = JSON.parse(body);
                console.log(rss);
                res.send(JSON.stringify(rss.responseData.feed.entries));
            } else {
                console.error('An error happened ' + url);
            }
        });
    } );


    app.route('/auth/facebook').get(
        adminPolicy.isAllowed,
        passport.authenticate('facebook'),
        function (req, res) {
        }
    );

    app.route('/auth/facebook/callback').get(
        adminPolicy.isAllowed,
        passport.authenticate('facebook', {failureRedirect: '/index.html#denied'}),
        function (req, res) {
            console.log('call back success - redirecting to index#feed');
            res.redirect('/index#feed');
        }
    );

    app.route('/auth/github').get(
        adminPolicy.isAllowed,
        passport.authenticate('github'),
        function (req, res) {
        }
    );

    app.route('/auth/github/callback').get(
        adminPolicy.isAllowed,
        passport.authenticate('github', {failureRedirect: '/index.html#denied'}),
        function (req, res) {
            console.log('call back success - redirecting to index#feed');
            res.redirect('/index#feed');
        }
    );

};