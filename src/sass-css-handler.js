var path = require('path');
var fs = require('fs');
var sass = require('node-sass');
var assign = require('object-assign');


module.exports = function(basePath, options) {
    options = assign({
        plugins: [],
        extname: ".scss"
    }, options);


    return function sassCssHandler(req, res, next) {
        var moduleId = path.join(path.dirname(req.path), path.basename(req.path, path.extname(req.path))).substr(1);
        var srcPath = path.join(basePath, moduleId + options.extname);

        statFileOrNull(srcPath, function(err, stat) {
            if (err) return next(err);
            if (!stat) return next();

            res.set("Cache-Control", "public, max-age=0");
            res.set("Last-Modified", stat.mtime);
            res.set('Content-Type', 'text/css');

            renderSassFile(srcPath, function(err, result) {
                if (err) return next(err);

                res.end(result.css.toString());
            });
        });

    };

};


function statFileOrNull(srcPath, cb) {
    fs.stat(srcPath, function(err, stat) {
        if (err) {
            if (err.code === 'ENOENT') return cb(null, null);
            return cb(err);
        }
        if (!stat.isFile()) return cb(null, null);

        cb(null, stat);
    });
}


function renderSassFile(srcPath, cb) {
    sass.render({
        file: srcPath
    }, cb);
}
