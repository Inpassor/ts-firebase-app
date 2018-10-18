"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var helmet = require("helmet");
var session = require("express-session");
var cors = require("cors");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var ejs = require("ejs");
var sanitizer = require("express-sanitizer");
var handlers_1 = require("./handlers");
exports.expressApp = function (config) {
    var app = express();
    app.config = config;
    if (config.helmet) {
        app.use(helmet(config.helmet));
    }
    if (config.session) {
        app.use(session(config.session));
    }
    if (config.cors) {
        app.use(cors(config.cors));
    }
    if (config.cookieParser && config.cookieParser.secret) {
        app.use(cookieParser(config.cookieParser.secret, config.cookieParser.options));
    }
    if (config.bodyParser) {
        if (config.bodyParser.raw) {
            app.use(bodyParser.raw(config.bodyParser.raw));
        }
        if (config.bodyParser.json) {
            app.use(bodyParser.json(config.bodyParser.json));
        }
        if (config.bodyParser.text) {
            app.use(bodyParser.text(config.bodyParser.text));
        }
        if (config.bodyParser.urlencoded) {
            app.use(bodyParser.urlencoded(config.bodyParser.urlencoded));
        }
    }
    if (config.sanitizer) {
        app.use(sanitizer(config.sanitizer));
        app.use(handlers_1.sanitize);
    }
    if (config.firebase) {
        app.use(handlers_1.firebase(config.firebase));
    }
    if (config.models) {
        app.use(handlers_1.models(config.models));
    }
    if (config.routes) {
        app.use(handlers_1.routes({
            routes: config.routes,
            authType: config.authType,
        }));
    }
    if (config.viewsPath) {
        app.set('views', config.viewsPath);
        app.set('view engine', 'ejs');
        app.engine(config.viewsExtension || 'html', ejs.renderFile);
    }
    return app;
};
//# sourceMappingURL=express-app.js.map