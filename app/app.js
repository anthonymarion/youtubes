var file = require('file');
var fs = require('fs');
var _ = require('underscore');

var Templates = (function() {
	var templateDir = fs.realpathSync(__dirname + "/backbone/templates/");
	var templates = [];
	
	file.walkSync(templateDir, function(dirPath, dirs, files) {
		var relativeDirPath = dirPath.replace(templateDir, '');

		files.forEach(function(fileName) {
			var templateName = relativeDirPath + '/' + fileName.replace(/\.ejs$/, '');
			templateName = templateName.replace(/^\//, '');

			templates.push({
				name: templateName,
				source: _.template(fs.readFileSync(dirPath + '/' + fileName, 'utf8')).source
			});
		});
	});

	return templates;
})();

var backboneObjects = (function() {
	var backboneDir = fs.realpathSync(__dirname + "/backbone/");
	var directoryLoadOrder = ['models', 'collections', 'views'];

	var objects = [];

	directoryLoadOrder.forEach(function(directoryName) {
		directoryName = backboneDir + '/' + directoryName;
		file.walkSync(directoryName, function(dirPath, dirs, files) {
			files.forEach(function(fileName) {
				if (!/.js$/.test(fileName)) return;

				var objectName = fileName.replace(/.js$/, '');

				objects.push({
					name: objectName,
					source: fs.readFileSync(dirPath + '/' + fileName, 'utf8')
				});
			});
		});
	});

	return objects;
})();

module.exports = {
	index: function(req, res) {
		res.render("index");
	},

	app: function(req, res) {
		res.set('Content-Type', 'text/javascript');

		res.render("app", { templates: Templates, backboneObjects: backboneObjects });
	}
}
