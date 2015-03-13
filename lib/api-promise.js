module.exports = {
    handle: function (router, path) {

        'use strict';

        return function (req, res, next) {
            var func = router[path],
                result = func.call(router, req, res, next),
                errorHandler,
                promise;
            if (typeof (result.then) === 'function') {
                errorHandler = function (err) {
                    if (!err) {
                        err = {};
                    }

                    var e = {
                        code: err.code || 500,
                        message: typeof err === 'string' ? err : err.message || err
                    };

                    console.log('Api Error:', e);

                    res.status(e.code).json(e);
                };
                promise = result.then(function (result) {
                    if (result) {
                        res.json(result);
                    } else {
                        res.end();
                    }
                });

                if (promise.catch) {
                    promise.catch(errorHandler);
                } else if (promise.fail) {
                    promise.fail(errorHandler);
                }
            } else {
                res.status(200).json(result);
            }
        };
    }
};
