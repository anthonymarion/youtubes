#!/usr/bin/env node

var express = require("express");
var routes = require("./app/app.js");
var http = require("http");
var path = require("path");

var app = express();

app.configure(function() {
	app.set("port", process.env.PORT || 3000);
	app.set("views", __dirname + "/app/views");
	app.set("view engine", "ejs");
	app.use(express.favicon());
	app.use(express.logger("dev"));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser("your secret here"));
	app.use(express.session());
	app.use(app.router);
	app.use(require("less-middleware")({
	  src: __dirname + "/public"
	}));

	app.use(express["static"](path.join(__dirname, "public")));
});

app.configure("development", function() {
	app.use(express.errorHandler());
});

app.get("/", routes.index);

// TODO: Make this route precompiled for production
app.get("/app.js", routes.app);

http.createServer(app).listen(app.get("port"), function() {
	return console.log("Express server listening on port " + app.get("port"));
});
