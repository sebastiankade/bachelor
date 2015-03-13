var _ = require('underscore'),
    p = require('path');

module.exports = function (version) {

    'use strict';

    var self = this;

    this.version = version;

    this.router = function (Router) {
        if (Router) {
            this._router = new Router();
        }
        return this._router;
    };

    this.handler = function (handler) {
        if (handler) {
            this._handler = handler;
        }

        return this._handler;
    };

    this.defaultPermission = function (defaultPermission) {
        this.permission = defaultPermission;
    };

    this.route = function (path, router, config) {
        _.each(config, function (innerConfig, innerPath) {
            var fullPath = p.join(path, innerPath);
            _.each(innerConfig, function (key, verb) {
                if (['get', 'put', 'post', 'delete'].indexOf(verb) < 0) {
                    return;
                }

                self.router()
                    .route(fullPath,
                        verb.toLowerCase(),
                        self.handler().handle(router, key),
                        innerConfig.permission || self.permission);
            });
        });
    };

    this.router(require('./api-express.js'));
    this.handler(require('./api-promise.js'));
};
