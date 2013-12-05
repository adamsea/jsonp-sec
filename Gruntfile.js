module.exports = function(grunt) {

	grunt.initConfig({

		// Add package.json as an object for config
		pkg: grunt.file.readJSON('package.json'),

		// JSHint - Lint files for development
		jshint: {
			options: {
				jshintrc: ".jshintrc"
			},

			files: ["Gruntfile.js", "jsonp-sec.js", "test/qunit/tests/**/*.js"]
		},

		// QUnit test runner
		qunit: {
			all: ["test/qunit/index.html"]
		}

	});

	grunt.registerTask("default", ["test"]);
	grunt.registerTask("test", ["jshint", "qunit"]);

	// Load npm modules for tasks
	grunt.loadNpmTasks("grunt-contrib-qunit");
	grunt.loadNpmTasks("grunt-contrib-jshint");

};
