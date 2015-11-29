var path = require('path');
var express = require('express');
var sassCssHandler = require('../');
var basePath = path.join(__dirname, '..', 'test');

module.exports = function() {
    var app = express();

    app.get('*.css', sassCssHandler(basePath));

    return app;
};
