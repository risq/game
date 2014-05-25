module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-node-webkit-builder');
    grunt.loadNpmTasks('grunt-exec');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        connect: {
            server: {
                options: {
                    port: 8080,
                    base: './deploy'
                }
            }
        },
        concat: {
            dist: {
                src: [  "src/lib/**/*.js",
                    "src/game/**/*.js"
                     ],
                dest: 'deploy/js/<%= pkg.name %>.js'
            }
        },
        watch: {
            files: 'src/**/*.js',
            tasks: ['concat']
        },
        nodewebkit: {
            options: {
                build_dir: './build',
                mac: false,
                win: true,
                linux32: false,
                linux64: false
            },
            src: ['./deploy/**/*']
        },
        open: {
            dev: {
                path: 'http://localhost:8080/index.html'
            }
        },
        exec: {
            runWin : {
                cmd: 'build\\releases\\game\\win\\game\\game.exe'
            }
        }
    });

    grunt.registerTask('default', ['concat', 'connect', 'open', 'watch']);
    grunt.registerTask('build', ['concat', 'nodewebkit', 'exec:runWin']);

};