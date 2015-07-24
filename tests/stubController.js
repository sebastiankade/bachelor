(function () {
    'use strict';
    var Q = require('q');

    module.exports = {
        successObject: function () {
            return {
                goodTimes: 'right now'
            };
        },
        successPromise: function () {
            return Q.when({
                goodTimes: 'coming'
            });
        },
        errorRoute: function () {
            return Q.reject('Failed');
        }
    };
}(module));
