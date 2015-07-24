/*global describe, beforeEach, it, jasmine, expect*/
(function () {
    'use strict';

    var promiseRouter = require("../lib/api-promise"),
        controller = require("./stubController"),
        req,
        res,
        next;

    describe("Api Promise Router", function () {
        beforeEach(function () {
            req = jasmine.createSpyObj('req', ['nothing']);
            res = jasmine.createSpyObj('res', ['json', 'end', 'status']);
            next = jasmine.createSpy();
        });

        describe('on success', function () {
            it("should route promise results", function (done) {
                promiseRouter.handle(controller, 'successObject')(req, res, next)
                    .finally(function () {
                        expect(res.status).toHaveBeenCalledWith(200);
                        expect(res.json).toHaveBeenCalled();
                        done();
                    });
            });

            it("should route object results", function (done) {
                promiseRouter.handle(controller, 'successPromise')(req, res, next)
                    .finally(function () {
                        expect(res.status).toHaveBeenCalledWith(200);
                        expect(res.json).toHaveBeenCalled();
                        done();
                    });
            });
        });

        describe('on error', function () {
            it("should route errors", function (done) {
                promiseRouter.handle(controller, 'errorRoute')(req, res, next)
                    .finally(function () {
                        expect(res.status).toHaveBeenCalledWith(500);
                        expect(res.json).toHaveBeenCalled();
                        done();
                    });
            });
        });

        describe('when using interceptors', function () {
            var errorInterceptor,
                successInterceptor;

            beforeEach(function () {
                errorInterceptor = jasmine.createSpy('error');
                successInterceptor = jasmine.createSpy('success');

                promiseRouter.then(successInterceptor).catch(errorInterceptor);
            });

            it("should pipe through success interceptor", function (done) {

                promiseRouter.handle(controller, 'successObject')(req, res, next)
                    .finally(function () {
                        expect(successInterceptor).toHaveBeenCalled();
                        expect(errorInterceptor).not.toHaveBeenCalled();
                        done();
                    });
            });

            it("should pipe through error interceptor", function (done) {
                promiseRouter.handle(controller, 'errorRoute')(req, res, next)
                    .finally(function () {
                        expect(successInterceptor).not.toHaveBeenCalled();
                        expect(errorInterceptor).toHaveBeenCalled();
                        done();
                    });
            });
        });
    });
}());
