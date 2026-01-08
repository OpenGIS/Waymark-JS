module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),

		less: {
			js_css: {
				files: {
					"src/css/Waymark_Map.css": "src/less/Waymark_Map.less",
					"src/css/Waymark_Map_Viewer.css": "src/less/Waymark_Map_Viewer.less",
					"src/css/Waymark_Map_Editor.css": "src/less/Waymark_Map_Editor.less",
				},
			},
		},

		concat: {
			js_js: {
				src: [
					"libs/js/leaflet.min.js",
					"libs/js/*",
					"src/js/Waymark_Map.js",
					"src/js/Waymark_Map_Viewer.js",
					"src/js/Waymark_Map_Editor.js",
					"src/js/Waymark_Map_Factory.js",
				],
				dest: "dist/js/waymark-js.js",
			},
			js_css: {
				src: ["libs/css/*.css", "src/css/*.css"],
				dest: "dist/css/waymark-js.css",
			},
		},

		terser: {
			js_js: {
				files: {
					"dist/js/waymark-js.min.js": ["dist/js/waymark-js.js"],
				},
			},
		},

		cssmin: {
			js_css: {
				files: {
					"dist/css/waymark-js.min.css": "dist/css/waymark-js.css",
				},
			},
		},

		copy: {
			src_images: {
				files: [
					{
						expand: true,
						cwd: "src/images/",
						src: ["**"],
						dest: "dist/images/",
					},
				],
			},
			libs_images: {
				files: [
					{
						expand: true,
						cwd: "libs/images/",
						src: ["**"],
						dest: "dist/images/",
					},
				],
			},
			libs_fonts: {
				files: [
					{
						expand: true,
						cwd: "libs/fonts/",
						src: ["**"],
						dest: "dist/fonts/",
					},
				],
			},
			js: {
				files: [
					{
						expand: true,
						cwd: "dist/",
						src: ["**"],
						dest: "docs/public/dist/latest/",
					},
				],
			},
		},

		watch: {
			js_js: {
				files: ["src/js/*.js"],
				tasks: ["build_js_js", "copy:js"],
			},
			js_css: {
				files: ["src/less/*.less"],
				tasks: ["build_js_css", "copy:js"],
			},
		},
	});

	grunt.loadNpmTasks("grunt-terser");
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-cssmin");
	grunt.loadNpmTasks("grunt-contrib-less");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-contrib-copy");

	grunt.registerTask("default", [
		"less",
		"concat",
		"terser",
		"cssmin",
		"copy",
		"watch",
	]);

	grunt.registerTask("build_js_js", ["concat:js_js", "terser:js_js"]);

	grunt.registerTask("build_js_css", [
		"less:js_css",
		"concat:js_css",
		"cssmin:js_css",
	]);
};
