/* jshint undef: false  */

var when = require('when');
var when_node = require('when/node');
var rest = require('rest');
var fs = require('fs');
var sass = require('node-sass');
var path = require('path');

var when_readFile = when_node.lift(fs.readFile.bind(fs));
var when_render = when_node.lift(sass.render.bind(sass));


describe('test', function() {

    var server = useServer();

    testFile('tester');

    function testFile(name) {

        it('test ' + name, function() {

            return when_render({
                file: path.join(__dirname, name + '.scss')
            }).
            then(function(result) {
                return result.css.toString();
            }).
            then(stripComments).
            then(function(css) {
                return rest(server.url + '/' + name + '.css').
                then(function(response) {
                    return response.entity;
                }).
                then(stripComments).
                should.eventually.equal(css);
            });

        });

    }

});


function stripComments(contents) {
    return contents.replace(/\/\*[\s\S]*\*\//g, '');
}
