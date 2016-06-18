var express = require('express');

module.exports = function () {

    'use strict';

    this.router = express.Router();

    this.route = function (path, verb, handler, permission) {
        var route = this.router.route(path);

        if (permission) {
            route[verb](permission);
        }

        route[verb](handler);
    };
};
