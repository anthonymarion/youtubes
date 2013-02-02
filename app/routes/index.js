var file = require('file');
var fs = require('fs');
var _ = require('underscore');

var Templates = (function(callback) {
	var templateDir = fs.realpathSync(__dirname + "/../templates/");
	var templates = [];
	
	file.walkSync(templateDir, function(dirPath, dirs, files) {
		var relativeDirPath = dirPath.replace(templateDir, '');

		_(files).each(function(fileName) {
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

module.exports = {
	index: function(req, res) {
		res.render("index", { title: "Express" });
	},

	templates: function(req, res) {
		res.set('Content-Type', 'text/javascript');

		res.render("templates", { templates: Templates });
	}
}
