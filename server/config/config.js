/**
 * Created by antoine on 11/02/16.
 */
'use strict';

module.exports  = {
    port: 5050,
    host: '127.0.0.1',
    favicon: './client/img/favicon.png',
    folders: [
        {
            static: '/scripts',
            real: 'client/scripts'
        },
        {
            static: '/img',
            real: 'client/img'
        },
        {
            static: '/bower_components',
            real: 'client/bower_components'
        },
    ],
    server: {
        serverViews: ['./server/views/*.jade'],
        serverJS:  ['./server/**/*.js', './server/*.js', './server.js'],
        clientJS: ['./client/*.js', './client/**/*.js'],
        clientCSS: ['./client/**/*.css']
    },
    facebook: {
        clientID: '710102429126826',
        clientSecret: '0a8fa1812a383532b1f411752199b051',
        callbackURL: "http://localhost:5050/auth/facebook/callback"
    },
    github: {
        clientID: 'f16a8eae4984bc75d6bd',
        clientSecret: 'ba780a6b0fb6bd79dfb577f6c3fd3c472b4fe9a9',
        callbackURL: "http://localhost:5050/auth/github/callback"
    }
};