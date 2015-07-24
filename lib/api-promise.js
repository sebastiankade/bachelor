/*jslint unparam:true*/
(function (module) {
    'use strict';
    var Q = require('q');

    module.exports = {
        then: function (interceptor) {
            this.successInterceptor = interceptor;
            return this;
        },
        catch: function (interceptor) {
            this.errorInterceptor = interceptor;
            return this;
        },

        // Api Router Interface
        handle: function (router, path) {
            var self = this;

            return function (req, res, next) {
                var func = router[path],
                    result = func.call(router, req, res, next);

                return Q.when(result)
                    /* Interceptors */
                    .then(function (result) {
                        if (self.successInterceptor) {
                            return self.successInterceptor(result);
                        }
                        return result;
                    })
                    .catch(function (err) {
                        var modifiedError;
                        if (self.errorInterceptor) {
                            modifiedError = self.errorInterceptor(err);

                            if (!modifiedError) {
                                return Q.reject(err);
                            }

                            if (modifiedError && typeof modifiedError.then !== 'function') {
                                return Q.reject(modifiedError);
                            }

                            return modifiedError;
                        }

                        return Q.reject(err);
                    })
                    /* Handling Result */
                    .then(function (result) {
                        res.status(200);

                        if (result) {
                            res.json(result);
                        } else {
                            res.end();
                        }
                    })
                    .catch(function (err) {
                        if (!err) {
                            err = {};
                        }

                        var e = {
                            code: err.code || 500,
                            message: typeof err === 'string' ? err : err.message || err
                        };

                        console.log('Api Error:', e);

                        res.status(e.code);
                        res.json(e);
                    });
            };
        }
    };
}(module));
