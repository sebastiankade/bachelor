(function () {

    'use strict';

    module.exports = {
        define: function (key, func) {
            this[key] = function (params) {
                var callback = func(params);
                return function (req, res, next) {
                    var allowed = callback(req);
                    if (allowed) {
                        next();
                    } else {
                        res.status(401).json({
                            code: 401,
                            message: 'Permission Denied.'
                        });
                    }
                };
            };
        }
    };

    // Default Permission Types
    module.exports.define('public', function () {
        return function () {
            return true;
        };
    });

    module.exports.define('never', function () {
        return function () {
            return false;
        };
    });

}());
