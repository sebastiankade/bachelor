(function () {
    'use strict';

    var express = require('express'),
        app = express(),
        http = require('http').Server(app),
        Q = require('q'),
        port = process.env.PORT || 3030,

        /* Api Setup */
        Bachelor = require('../lib'),
        api = new Bachelor.Api('version-1');

    Bachelor.Promise
        .then(function (garbage) {
            // Success Interceptor
            console.log('Intercepted Success');
            return garbage;
        })
        .catch(function (err) {
            // Error Interceptor
            console.log('Intercepted Error');
            return Q.reject(err);
        });

    // Setup Bachelor Api
    app.use('/', api.router().router);

    api.route('/test', require('../stubController.js'), {
        '/one': {
            get: 'successObject'
        },
        '/two': {
            get: 'successPromise'
        },
        '/fail': {
            get: 'errorRoute'
        }
    });

    http.listen(port, function () {
        console.log('listening on port :' + port);
    });
}());
