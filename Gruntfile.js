// YaMaps Frontend Build with variants and flavors
//
// Variant: a customer-specific build with custom assets and views
// Flavor: a special configuration of a variant, e.g. for development,
//         testing, or production
//
// Hint: you way want to use `grunt serve` or `grunt` most of the time
//
// Usage
//  grunt            - builds, tests and minifies
//  grunt list       - list app configuration flavors
//  grunt serve      - runs local webserver serving a live development version
//  grunt test       - runs unit and CI tests locally
//  grunt build      - builds minified version in ./dist and a compressed version in ./compressed
//  grunt cibuild    - runs unit tests before building minified versions
//  grunt clean      - removes temporary build files (./dist, ./build ./compressed)
//  grunt distclean  - removes all build files and node_modules (you must run npm install again)
//
// Directories
//  ./build      - temporary build files, usable for local development and tests
//  ./dist       - minified build targets (all deployable scripts and assets)
//  ./compressed - compressed version of ./dist directory (all deployable scripts and assets,
//                 useful for S3 hosting, as S3 doesn't compress content on the fly)
//
'use strict';

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // need chalk for own multitask
  var chalk = require('chalk');
  var path = require('path');

  // add require for connect-modrewrite
  var modRewrite = require('connect-modrewrite');

  // build option to select specific customer builds
  var variant = grunt.option('variant') || 'generic';
  var flavor = grunt.option('flavor') || 'dev';

  // Note
  //
  // Grunt's grunt-clean default task has been renamed to gruntClean to avoid
  // running _all_ clean subtasks when calling `grunt clean`.
  //
  // Remeber to refer to clean task as **gruntClean** in `grunt.initConfig()`
  // and when including the task in other tasks.
  //
  grunt.renameTask('clean', 'gruntClean');

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    config: {
      // configurable paths
      app: require('./bower.json').appPath || 'app',
      build: 'build',
      dist: 'dist',
      target: 'target',
      compressed: 'compressed',
      variant: variant,
      flavor: flavor,
      pkg: grunt.file.readJSON('package.json'),
      banner: '/**\n * <%= config.pkg.name %> - <%= config.pkg.description %>\n' +
          ' * @version <%= config.revision %> - ' +
          'built on <%= grunt.template.today() %>\n' +
          ' * @link <%= config.pkg.homepage %>\n' +
          ' * @license <%= config.pkg.license %>\n' + ' */\n'
    },

    // use git to fetch current repository revision
    'git-describe': {
      options: {
        template: '{%=object%}{%=dirty%}'
      },
      // empty target to make task run
      dist: {}
    },
    revision: {
      options: {
        property: 'config.revision',
        ref: 'HEAD',
        short: true
      }
    },

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      js: {
        files: [
          '<%= config.app %>/scripts/{,*/}*.js',
          '<%= config.app %>/variants/*/scripts/{,*/}*.js'
        ],
        tasks: [
          'newer:jshint:all',           // lint changed files
          'newer:jscs:src',     // jscs changed files
          // 'copy:vendor',        // copy vendor files in bower_components
          'copy:generic',       // copy main/generic application files
          'copy:variant',       // overwrite and extend with files from build variant
          'update_docs',        // prepare copying docu scripts
          'ngdocs'              // build documentation from source files
        ]
      },
      json: {
        files: [
          '<%= config.app %>/assets/*/*.{json,md}',
          '<%= config.app %>/variants/' + variant + '/assets/lang/*.{json,md}'
        ],
        tasks: [
          'newer:jshint:all',   // lint changed files
          // 'json-pretty',   // json pretty
          'copy:generic',       // copy main/generic application files
          'copy:variant',       // overwrite and extend with files from build variant
          // 'i18n',                // build/merge language files
          'html2js:md'             // compile markdown templates into templatecache
        ]
      },
      html: {
        files: [
          '<%= config.app %>/index.html',
          '<%= config.app %>/templates/{,*/}*.html',
          '<%= config.app %>/variants/*/templates/{,*/}*.html'
        ],
        tasks: [
          'index',              // create variant-specific index.html
          // 'copy:vendor',        // copy vendor files in bower_components
          'copy:generic',       // copy main/generic application files
          'copy:variant',       // overwrite and extend with files from build variant
          'html2js'             // compile html templates into templatecache
        ]
      },
      jsTest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['newer:jshint:test', /*'jscs:test',*/ 'karma']
      },
      sass: {
        files: '<%= config.app %>/variants/' + variant + '/scss/{,*/}*.scss',
        tasks: [
          'sass:dev' ,
          'concat:styles',      // mix style files
          'replace:styles',     // replace font file paths
          'postcss:dist'
          // 'autoprefixer'        // fill in missing {-webkit|-ms|-o|-moz} CSS attributes
        ]
      },
      styles: {
        files: [
          '<%= config.app %>/styles/{,*/}*.css'
          // , '<%= config.app %>/variants/*/styles/{,*/}*.css'
        ],
        tasks: [
          'concat:styles',      // mix style files
          'replace:styles',     // replace font file paths
          'postcss:dist'
          // 'autoprefixer'        // fill in missing {-webkit|-ms|-o|-moz} CSS attributes
        ]
      },
      docs: {
        files: ['docs/*/*.ngdoc'],
        tasks: ['update_docs', 'ngdocs']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= config.build %>/{,*/}*.html',
          '<%= config.build %>/scripts/{,*/}*.js',
          '<%= config.build %>/styles/{,*/}*.css',
          '<%= config.build %>/assets/**/*.{png,jpg,jpeg,json,svg}'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: process.platform === "win32" ? '127.0.0.1' : '0.0.0.0',
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
          base: ['<%= config.build %>'],
          // MODIFIED: Add this middleware configuration
          middleware: function(connect, options) {
            var middlewares = [];

            // Matches everything that does not contain a '.' (period) inside the path
            // Note: does not match query parameter contents which may contain '.'
            middlewares.push(modRewrite(['^([^\\.]*$|[^\\.?]*?\\?.*)$ /index.html [L]']));

            options.base.forEach(function(base) {
              middlewares.push(connect.static(base));
            });
            return middlewares;
          }
        }
      },
      test: {
        options: {
          port: 9001,
          base: [
            'test',
            '<%= config.build %>'
          ]
        }
      },
      dist: {
        options: {
          base: '<%= config.dist %>'
        }
      },
      docs: {
        options: {
          port: 9002,
          base: ['<%= config.build %>/docs'],
          // MODIFIED: Add this middleware configuration
          middleware: function(connect, options) {
            var middlewares = [];

            middlewares.push(modRewrite([
              // rewrite all routes except when ending at known file extensions
              // Note: do not match line ends ($) since fonts or css may use
              //       url parameters
              //
              '!\\.(js|html|png|jpg|css|eot|svg|ttf|woff|woff2) /index.html [L]'
            ]));
            // Matches everything that does not contain a '.' (period)
            options.base.forEach(function(base) {
              middlewares.push(connect.static(base));
            });
            return middlewares;
          }
        }
      }
    },

    // Cleans build directories
    //
    gruntClean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '<%= config.dist %>',
            '<%= config.target %>',
            '<%= config.compressed %>'
          ]
        }]
      },
      all: {
        files: [{
          dot: true,
          src: ['node_modules', 'test-results.xml']
        }]
      },
      serve: '<%= config.build %>'
    },

    // Check JS code styles and catch common errors early
    //
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        // reporter: 'jslint',
        // reporterOutput: 'checkstyle-jshint.xml'
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%= config.app %>/assets/*/*.json',
        '<%= config.app %>/scripts/{,*/}*.js',
        '<%= config.app %>/variants/*/assets/*/*.json',
        '<%= config.app %>/variants/*/scripts/{,*/}*.js',
      ],
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/{,*/}*.js']
      },
      // jenkins report configuration
      depl: {
        options: {
          jshintrc: '.jshintrc',
          reporter: 'checkstyle',
          reporterOutput: '<%= config.build %>/reports/checkstyle-jshint.xml'
        },
        files: {
          src: [
            'Gruntfile.js',
            '<%= config.app %>/assets/*/*.json',
            '<%= config.app %>/scripts/{,*/}*.js',
            '<%= config.app %>/variants/*/assets/*/*.json',
            '<%= config.app %>/variants/*/scripts/{,*/}*.js',
          ]
        }
      }
    },

    // JSCS Code Formatter:
    //
    jscs: {
      src: [
        '<%= config.app %>/scripts/{,*/}*.js',
        '<%= config.app %>/variants/tlabs/scripts/*.js',
        '<%= config.app %>/variants/generic/scripts/*.js',
        'test/spec/{,*/}*.js',
        'Gruntfile.js'
      ],
      test: [
        'test/spec/{,*/}*.js'
          ],
      controllers: [
        '<%= config.app %>/scripts/controllers/*.js',
      ],
      services: [
        '<%= config.app %>/scripts/services/*.js',
        '<%= config.app %>/scripts/resources/*.js',
      ],
      resources: [
        '<%= config.app %>/scripts/resources/*.js',
      ],
      options: {
        config: '.jscsrc',
        reporter: 'console',
        // reporterOutput: 'checkstyle-jscs.xml',
        // errorFilter: 'jscs-error-filter.js',
        // preset: 'yandex',
        // If you use ES6 http://jscs.info/overview.html#esnext
        // esnext: true,
        // If you need output with rule names http://jscs.info/overview.html#verbose
        // verbose: true,
        requireCurlyBraces: [ "if" ]
      },
      // jenkins report configuration
      depl: {
        options: {
          config: '.jscsrc',
          reporter: 'checkstyle',
          reporterOutput: '<%= config.build %>/reports/checkstyle-jscs.xml',
          requireCurlyBraces: [ "if" ]
        },
        files: {
          src: [
            '<%= config.app %>/scripts/{,*/}*.js',
            '<%= config.app %>/variants/tlabs/scripts/*.js',
            '<%= config.app %>/variants/generic/scripts/*.js',
            'test/spec/{,*/}*.js',
            'Gruntfile.js'
          ]
        }
      }
    },

    // Copy and merge files to build directory so later tasks can use them
    // (also copies compiled results to dist)
    //
    copy: {
      vendor: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>',
          dest: '<%= config.build %>',
          src: [
            'bower_components/**/*.js',
            '!**/*.min.js',
            '!.#*',
            '!*~'
          ],
        }, {
          expand: true,
          flatten: true,
          cwd: '<%= config.app %>',
          dest: '<%= config.build %>/assets/fonts/',
          src: [
            'bower_components/font-awesome/fonts/*.{eot,svg,ttf,woff,woff2}'
          ]
        }]
      },
      generic: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>',
          dest: '<%= config.build %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            'sitemap.xml',
            'assets/{data,fonts,images}/**/*.{png,jpg,jpeg,json,eot,svg,ttf,woff,woff2}',
            'assets/lang/*.md',
            'scripts/**',
            '!scripts/conf-*',
            'templates/**',
            '!.#*',
            '!*~'
          ]
        }]
      },
      variant: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/variants/' + variant,
          dest: '<%= config.build %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            'assets/{data,fonts,images}/**/*.{png,jpg,jpeg,json,eot,svg,ttf,woff,woff2}',
            'assets/lang/*.md',
            'scripts/**',
            '!scripts/conf-*',
            'templates/**',
            '!.#*',
            '!*~'
          ]
        }]
      },
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= config.build %>',
          dest: '<%= config.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            'index.html',
            'sitemap.xml',
            'assets/{data,fonts}/**',
            'assets/images/**/*.{png,jpg,jpeg}', // svg will be copied due to svgmin
            'scripts/yaMaps.*',
            'styles/yaMaps.*'
          ]
        }]
      }
    },

    // Compile Angular template files into JS to merge them with the main script
    // templates are loaded into angular's $templateCache at app start
    //
    html2js: {
      main: {
        options: {
          base: '<%= config.build %>/templates',
          module: 'yaMaps.templates.html',
          singleModule: true,
          htmlmin: {
            collapseBooleanAttributes: true,
            collapseWhitespace: true,
            removeComments: true,
            removeScriptTypeAttributes: true,
            // removeAttributeQuotes: true,
            // removeEmptyAttributes: true,
            // removeRedundantAttributes: true,
            // removeStyleLinkTypeAttributes: true
          }
        },
        src: ['<%= config.build %>/templates/*/*.html'],
        dest: '<%= config.build %>/scripts/templates.html.js'
      }
    },
    // json2js: {
    //   lang: {
    //     options: {
    //       base: '<%= config.build %>',
    //       module: 'yaMaps.templates.json',
    //     },
    //     src: ['<%= config.build %>/assets/lang/*.json'],
    //     dest: '<%= config.build %>/scripts/templates.json.js'
    //   }
    // },
    // SASS compiler configuration
    //
    sass: {
      dev: {
        options: {
          style: 'expanded'
        },
        files: [{
            expand: true,
            cwd: '<%= config.app %>/variants/' + variant + '/scss/',
            src: ['{,*/}*.scss'],
            dest: '<%= config.build %>/generated-css/',
            ext: '.css'
          }]
      },
      dist: {
        options: {
          style: 'compressed'
        },
        files: [{
            expand: true,
            cwd: '<%= config.build %>/styles/',
            src: ['{,*/}*.scss'],
            dest: '<%= config.build %>/styles/',
            ext: '.css'
          }]
      }
    },
    // Add vendor prefixes to CSS styles (i.e. box-sizing -> -wekbit-box-sizing)
    //
    postcss: {
      options: {
        map: true,
        processors: [
                require('autoprefixer-core')({
                  browsers: ['last 2 versions']
                })
            ]
      },
      dist: {
        src: '<%= config.build %>/styles/*.css'
      }
    },

    // Reads usemin blocks from index.html for automatic concat, minify in usemin
    //
    useminPrepare: {
      html: '<%= config.build %>/index.html',
      options: {
        staging: '<%= config.build %>',
        dest: '<%= config.build %>',
      }
    },

    // Renames asset files for caching purposes
    //
    filerev: {
      options: {
        algorithm: 'md5',
        length: 8
      },
      images: {
        src: [
          '<%= config.build %>/assets/images/**/*.{png,jpg,jpeg,svg}'
        ]
      }
    },

    //
    // Purify CSS (Get rid of unused css)
    //
    purifycss: {
      options: {},
      target: {
        src: ['<%= config.build %>/templates/**/*.html', '<%= config.build %>/scripts/**/*.js'],
        css: ['<%= config.build %>/generated-css/main.css'],
        dest: '<%= config.build %>/generated-css/main.css'
      },
    },

    // Optimize and Minimize SVG
    //
    svgmin: {
      options: {
        plugins: [
                {
                  removeViewBox: false
                }, {
                  removeUselessStrokeAndFill: false
                }
            ]
      },
      dist: {
        files: [{
          expand:true,
          cwd: '<%= config.build %>/assets/images',
          src: ['{,**/}*.svg'],
          dest: '<%= config.dist %>/assets/images'
        }]
      }
    },

    //
    // Responsive images
    //
    responsive_images: {
      //  main: {
      //   options: {
      //     engine: 'im',
      //     // sizes: [{
      //     //   name: 'small', width: 320
      //     // }, {
      //     //   name: 'medium', width: 640
      //     // }, {
      //     //   name: 'large', width: 1024
      //     // }]
      //   },
      //   //   files: [{
      //   //   expand: true,
      //   //   src: ['img/**/*.{gif,png,jpg,jpge}'],
      //   //   cwd: 'src/',
      //   //   dest: 'dist/'
      //   // }]
      //   files: [{
      //     expand: true,
      //     src: ['assets/images/{,**/}/*.{gif,png,jpg,jpge}'],
      //     cwd: 'build/',
      //     dest: 'build/'
      //   }]
      // },
      dist: {
       options: {
         engine: 'im',
         // sizes: [{
         //   name: 'small', width: 320
         // }, {
         //   name: 'medium', width: 640
         // }, {
         //   name: 'large', width: 1024
         // }]
       },
       //   files: [{
       //   expand: true,
       //   src: ['img/**/*.{gif,png,jpg,jpge}'],
       //   cwd: 'src/',
       //   dest: 'dist/'
       // }]
       files: [{
         expand: true,
         src: ['assets/images/{,**/}/*.{gif,png,jpg,jpge}'],
         cwd: 'build/',
         dest: 'build/'
       }]
     }
    },
    //
    // Responsive images Extender
    //
    responsive_images_extender: {
      dist: {
        options: {
          baseDir: 'build',
          ignore: [
            '[ng-src]',
            'img[src$=".svg"]',
            'img[src^="//"]',
            '[call-state-error]',
            'div[call-state-error]',
            '[ng-init]',
            '[ng-model]',
            '[ng-options]',
            'thead',
            'thead[ng-init*="pagedCtrl"]',
            '[ng-init~=pagedCtrl]',
            '.badge'
          ],
          // sizes: [{
          //   selector: 'img',
          //   sizeList: [{
          //       cond: 'min-width: 300px',
          //       size: '50vw'
          //     }, {
          //       cond: 'min-width: 700px',
          //       size: '70vw'
          //     }, {
          //       cond: 'default',
          //       size: '100vw'
          //   }]
          // }]
        },
        files: [{
          expand: true,
          src: ['templates/{,**/}/*.html', 'index.html', 'assets/lang/*.md'],
          cwd: 'build/',
          dest: 'build/'
        }]
      },
      // default_options: {
      //   // baseDir: 'build',
      //   files: [{
      //    expand: true,
      //    src: ['{,**/}/*.html'],
      //    cwd: '<%= config.build %>/templates/views/',
      //    dest: '<%= config.build %>/templates/views/'
      //  }]
      // },
      // use_sizes: {
      //   options: {
      //     sizes: [{
      //       selector: 'img',
      //       sizeList: [{
      //         cond: 'max-width: 30em',
      //         size: '100vw'
      //       }, {
      //         cond: 'max-width: 50em',
      //         size: '50vw'
      //       }, {
      //         cond: 'default',
      //         size: 'calc(33vw - 100px)'
      //       }]
      //     }, {
      //       selector: '[alt]',
      //       sizeList: [{
      //         cond: 'max-width: 20em',
      //         size: '80vw'
      //       }, {
      //         cond: 'default',
      //         size: '90vw'
      //       }]
      //     }]
      //   },
      //   files: [{
      //    expand: true,
      //    src: ['{,**/}/*.{html}'],
      //    cwd: '<%= config.build %>/templates/views',
      //    dest: '<%= config.build %>/templates/views'
      //  }]
      // },
      // // polyfill_lazyloading: {
      // //   options: {
      // //     srcsetAttributeName: 'data-srcset',
      // //     srcAttribute: 'none'
      // //   },
      // //   files: {
      // //     'test/tmp/polyfill_lazyloading.html': 'test/fixtures/testing.html'
      // //   }
      // // },
      // all: {
      //   options: {
      //     // ignore: ['.ignore-me'],
      //     srcAttribute: 'smallest',
      //     sizes: [{
      //       selector: 'img',
      //       sizeList: [{
      //         cond: 'max-width: 30em',
      //         size: '100vw'
      //       }, {
      //         cond: 'max-width: 50em',
      //         size: '50vw'
      //       }, {
      //         cond: 'default',
      //         size: 'calc(33vw - 100px)'
      //       }]
      //     }]
      //   },
      //   files: [{
      //    expand: true,
      //    src: ['{,**/}/*.{html}'],
      //    cwd: '<%= config.build %>/templates/views',
      //    dest: '<%= config.build %>/templates/views'
      //  }]
      // }
    },

    //
    // Shows unused images
    //
    unusedImages: {
      options: {
        imgPath: 'build/assets/images/',
        srcPath: ['build/scripts/**/*.js', 'build/generated-css/main.css']
      }
    },
    // Optimize and minimize png, jpg
    //
    // Note: This would strip out the md5 part of filenames,
    //       so do the filerev afterwards this task is done.
    //
    imagemin: {
      png: {
        options: {
          optimizationLevel: 7
        },
        files: [
          {
            // Set to true to enable the following options…
            expand: true,
            // cwd is 'current working directory'
            cwd: '<%= config.build %>/assets/images',
            src: ['{,*/}*.png'],
            // Could also match cwd line above. i.e. project-directory/img/
            dest: '<%= config.build %>/assets/images',
            ext: '.png'
          }
        ]
      },
      jpg: {
        options: {
          progressive: true
        },
        files: [
          {
            // Set to true to enable the following options…
            expand: true,
            // cwd is 'current working directory'
            cwd: '<%= config.build %>/assets/images',
            src: ['{,*/}*.jpg'],
            // Could also match cwd. i.e. project-directory/img/
            dest: '<%= config.build %>/assets/images',
            ext: '.jpg'
          }
        ]
      }
    },

    // Generates concatenated and minified JS/CSS, rewrites paths based on filerev output
    //
    usemin: {
      html: '<%= config.build %>/index.html',
      html_srcset: ['<%= config.build %>/templates/{,**/}/*.html', '<%= config.build %>/assets/{,**/}/*.md'],
      js: '<%= config.build %>/scripts/*.min.js',
      css: '<%= config.build %>/styles/*.min.css',
      json: '<%= config.build %>/assets/lang/*.json',
      options: {
        assetsDirs: [
          // need this to capture "/assets/images/...." in index.html
          '<%= config.build %>',
          // need this to capture "../assets/images/..." in CSS files
          '<%= config.build %>/assets',
          // need this to capture "/assets/images/..." in .json and .min.js file
          '<%= config.build %>/assets/images',
        ],
        patterns: {
          json: [[/['"]\/assets\/images\/([^'"]+)['"]/gm, 'Update image references in JSON language files']],
          css: [[/['"]\/assets\/images\/([^'"]+)['"]/gm, 'Update image references in CSS files']],
          js: [
            [/['"]\/assets\/images\/([^'"]+)['"]/gm, 'Update image file references in JS files'],
            [/['"]\/assets\/lang\/([^'"]+)['"]/gm, 'Update language data file references in JS files'],
            [/['"]\/assets\/data\/([^'"]+)['"]/gm, 'Update data file references in JS files']
          ],
          html_srcset: [[/['"]\/assets\/images\/([^'"]+)['"]/gm, 'Update the HTML with the new img filenames']]
          // html_srcset: [[/srcset.*\/(.*@2x\.png)/, 'Replacing reference to srcset images']]
        },
        // blockReplacements: {
        //   less: function (block) {
        //     console.log( block.dest );
        //     return '<img srcset="' + block.dest + '" />';
        //   }
        // }
      }
    },

    // Set some options for tasks that are implicitly run by usemin
    //
    uglify: {
      options: {
        report: 'min',
        mangle: false,
        sourceMap: true,
        compress: {
          dead_code: true
        }
      }
    },
    concat: {
      options: {
        stripBanners: true
      },
      // special concat task (called explicitly) to merge all css files
      styles: {
        src: [
          // '<%= config.app %>/bower_components/bootstrap/dist/css/bootstrap.css',
          // '<%= config.app %>/bower_components/bootstrap/dist/css/bootstrap-theme.css',
          // '<%= config.app %>/bower_components/angular-ui-select/dist/select.css',
          '<%= config.app %>/bower_components/font-awesome/css/font-awesome.css',
          '<%= config.app %>/bower_components/ngDialog/css/ngDialog.css',
          '<%= config.app %>/bower_components/ngDialog/css/ngDialog-theme-plain.css',
          '<%= config.build %>/generated-css/main.css',
          // '<%= config.app %>/variants/<%= config.variant %>/styles/{,*/}*.css'
        ],
        dest: '<%= config.build %>/styles/mixed.css'
      }
    },
    cssmin: {
      options: {
        keepSpecialComments: 0,
        report: 'min'
      }
    },

    // Fix font paths in vendor CSS by replacing them with our build/dist fontpath
    //
    replace: {
      styles: {
        src: ['<%= config.build %>/styles/mixed.css'],
        overwrite: true,
        replacements: [{
          from: '../fonts/',
          to: '/assets/fonts/'
        }]
      }
    },

    // Prefix finalised files with a banner
    //
    usebanner: {
      dist: {
        options: {
          position: 'top',
          banner: '<%= config.banner %>',
          linebreak: true
        },
        files: {
          src: [
            '<%= config.dist %>/scripts/*.min.js',
            '<%= config.dist %>/styles/*.min.css'
          ]
        }
      }
    },

    compress: {
      main: {
        options: {
          mode: 'gzip',
          level: 9,
        },
        expand: true,
        cwd: 'dist/',
        src: ['**/*'],
        dest: 'compressed/'
      }
    },

    // Test settings:
    //
    // Karma unit testing
    //
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
      // continuous: {
      //   configFile: 'karma.conf.js',
      //   singleRun: true,
      //   browsers: ['PhantomJS'],
      //   reporters: ['dots', 'junit'],
      //   junitReporter: {
      //     outputFile: 'test-results.xml'
      //   }
      // }
    },
    //
    // Protractor e2e testing
    //
    protractor: {
      options: {
        keepAlive: false, // continue, if a test fails?
        configFile: "protractor.conf.js"
      },
      run: {

      },
      // staging: { // Grunt requires at least one target to run so you can simply put 'all: {}' here too.
      //   options: {
      //     keepAlive: false, // continue, if a test fails?
      //     configFile: "protractor.conf.staging.js", // Target-specific config file
      //     args: {} // Target-specific arguments
      //   }
      // },

    },

    // Starts webdriver automatically, when needed
    protractor_webdriver: {
      start: {
        options: {
          path: 'node_modules/protractor/bin/',
          command: 'webdriver-manager start'
        }
      }
    },
    // Render static html for SEO purposes
    //
    htmlSnapshot: {
      all: {
        options: {
          // that's the path where the snapshots should be placed
          // it's empty by default which means they will go into the directory
          // where your Gruntfile.js is placed
          snapshotPath: 'snapshots/',
          // This should be either the base path to your index.html file
          // or your base URL. Currently the task does not use it's own
          // webserver. So if your site needs a webserver to be fully
          // functional configure it here.
          sitePath: 'https://www.yaMaps.com/',
          // you can choose a prefix for your snapshots
          // by default it's 'snapshot_'
          fileNamePrefix: '',
          // y default the task waits 500ms before fetching the html.
          // this is to give the page enough time to to assemble itself.
          // if your page needs more time, tweak here.
          msWaitForPages: 1000,
          // sanitize function to be used for filenames. Converts '#!/' to '_' as default
          // has a filename argument, must have a return that is a sanitized string
          sanitize: function (requestUri) {
            // returns 'index.html' if the url is '/', otherwise a prefix
            return requestUri.replace(/\.[^/.]+$/, '');
          },
          // sanitize: function (requestUri) {
          //   // returns 'index.html' if the url is '/', otherwise a prefix
          //   if (/\//.test(requestUri)) {
          //     return 'index.html';
          //   } else {
          //     return requestUri.replace(/\//g, 'prefix-');
          //   }
          // },
          // if you would rather not keep the script tags in the html snapshots
          // set `removeScripts` to true. It's false by default
          removeScripts: true,
          // set `removeLinkTags` to true. It's false by default
          removeLinkTags: true,
          // set `removeMetaTags` to true. It's false by default
          removeMetaTags: true,
          // Replace arbitrary parts of the html
          // replaceStrings:[
          //     {'this': 'will get replaced by this'},
          //     {'/old/path/': '/new/path'}
          // ],
          // allow to add a custom attribute to the body
          // bodyAttr: 'data-prerendered',
          // here goes the list of all urls that should be fetched
          urls: [
            'welcome',
            'home'
          ],
          // a list of cookies to be put into the phantomjs cookies jar for the visited page
          // cookies: [
          //   {"path": "/", "domain": "localhost", "name": "lang", "value": "en-gb"}
          // ]
        }
      }
    },
    // Build documentation
    //
    ngdocs: {
      options: {
        // the output directory (e.g. a docs directory inside [config.dist])
        dest: 'build/docs',
        // scripts for dynamic load into the docs angular app (e.g. the minified
        // output of the built application)
        //
        // Note: *, ** are expanded before grunt-ngdocs copies files to [dest]/grunt-scripts
        //
        scripts: ['angular.js', 'build/scripts/**/*.js'],
        html5Mode: true,
        editExample: false,
        startPage: '/',
        title: 'Lambda Now Docs',
        titleLink: '/',
        bestMatch: true
      },
      api: {
        src: ['app/scripts/**/*.js'],
        title: 'API Reference'
      },
      guide: {
        src: ['docs/guide/*.ngdoc'],
        title: 'Developer Guide'
      },
      tutorial: {
        src: ['docs/tutorial/*.ngdoc'],
        title: 'Tutorial'
      }
    }
  });

  // List: List available variants and flavors
  //
  grunt.registerTask('list', function () {

    // iterate over all scripts ngdocs.options.scripts
    var variantPath = grunt.config('config.app') + '/variants/*';
    var variants = grunt.file.expand({ filter:'isDirectory' }, variantPath);

    grunt.log.writeln("Listing available build targets:\n");
    grunt.log.writeln("Variants (--variant)     Flavors (--flavor)");

    if (variants) {
      variants.map(function (v) {
        var files = grunt.file.expand({ filter:'isFile' }, v + '/scripts/conf-*');
        var filenames = [];
        if (files.length) {
          files.map(function (f) {
            var name = path.basename(f, '.js').replace('conf-', '');
            filenames.push(name);
          });
          grunt.log.writeln(grunt.log.table([25, 40], [path.basename(v), filenames.join(', ')]));
        } else {
          grunt.log.writeln(grunt.log.table([25, 40], [path.basename(v), chalk.red('no flavor configuration found')]));
        }
      });
    }
  });
  // Git: Extract git repository revision and store in grunt config variable
  //
  grunt.registerTask('git-revision', function() {
    grunt.event.once('git-describe', function (rev) {
      grunt.config('config.revision', rev.toString());
    });
    grunt.task.run('git-describe');
  });

  // Clean: Register new clean task
  //
  grunt.registerTask('distclean', ['gruntClean']);
  grunt.registerTask('clean', ['gruntClean:dist']);

  // Index: Build index.html with variant configuration
  //
  grunt.registerTask('index', 'Creating index.html file', function () {

    grunt.file.write(grunt.config('config.build') + '/index.html',
      grunt.template.process(grunt.file.read(grunt.config('config.app') + '/index.html'),
      {
        data: {
          revision: grunt.config('config.revision'),
          flavor: grunt.config('config.flavor'),
        }
      })
    );

    // config-<flavor>.js
    var configFile = 'conf-' + grunt.config('config.flavor') + '.js';
    var pkg = grunt.config('config.pkg');
    grunt.file.write(grunt.config('config.build') + '/scripts/' + configFile,
      // jscs:disable
      grunt.template.process(grunt.file.read(grunt.config('config.app') + '/variants/' + grunt.config('config.variant') + '/scripts/' + configFile),
      {
        data: {
          revision: grunt.config('config.revision'),
          flavor: grunt.config('config.flavor'),
          built: grunt.template.today(),
          version: pkg.version,
          license: pkg.license
        }
      })
      // jscs:enable
    );

  });

  // Docu: Collect app scripts for documentation app
  //
  grunt.registerTask('update_docs', function () {

    // iterate over all scripts ngdocs.options.scripts
    var scripts = grunt.config('ngdocs.options.scripts');
    var replacedScripts = [];
    if (scripts) {
      scripts.map(function (p) {
        var search = p;
        // ignore script paths containing '*'
        if (search.indexOf('*') < 0) {
          // insert a '*.' after the last '/' in the filename pattern
          var idx = search.lastIndexOf('/');
          if (idx !== -1) {
            search = search.substring(0, idx + 1) + '*.' + search.substring(idx + 2);
          } else {
            search = '*.' + search;
          }
        }
        var files = grunt.file.expand({ filter:'isFile' }, search);

        // append either replaced or original names
        if (files.length) {
          replacedScripts.push.apply(replacedScripts, files);
        } else {
          replacedScripts.push(p);
        }
      });

      // replace ngdocs.options.scripts in grunt config
      if (replacedScripts.length) {
        grunt.config('ngdocs.options.scripts', replacedScripts);
      }
    }
  });

  // Lang: mix language files from variants into single common file
  //
  grunt.registerMultiTask('trim-nulls', 'Trims null entries from JSON object files', function () {

    var options = this.options({
      replacer: null,
      space: "\t"
    });
    grunt.verbose.writeflags(options, "Options");
    // jscs: disable
    function trim_nulls (data) {
      var y;
      for (var x in data) {
        y = data[x];
        if (y === "null" || y === null || y === "" || typeof y === "undefined" || (y instanceof Object && Object.keys(y).length === 0)) {
          delete data[x];
        }
        if (y instanceof Object) { y = trim_nulls(y); }
      }
      return data;
    }
    // jscs: enable
    /* iterate over all src-dest file pairs */
    this.files.forEach(function (f) {
      try {
        /* start with an empty object */
        var json = {};

        /* merge JSON file into object */
        f.src.forEach(function (src) {
          if (!grunt.file.exists(src)) {
            throw "JSON source file \"" + chalk.red(src) + "\" not found.";
          } else {
            var source;
            grunt.log.debug("reading JSON source file \"" + chalk.green(src) + "\"");
            try { source = grunt.file.readJSON(src); }
            catch (e) { grunt.fail.warn(e); }
            // jscs: disable
            json = trim_nulls(source);
            // jscs: enable
          }

          /* write object as new JSON */
          grunt.log.debug("writing JSON destination file \"" + chalk.green(f.dest) + "\"");
          grunt.file.write(f.dest, JSON.stringify(json, options.replacer, options.space));
          grunt.log.writeln("File \"" + chalk.green(f.dest) + "\" created.");
        });
      }
      catch (e) {
        grunt.fail.warn(e);
      }
    });
  });

  // grunt.registerMultiTask('json2js', 'Converts JSON files to $templateCache entries', function () {

  //   var path = require('path');
  //   var util = require('util');
  //   var options = this.options({
  //     useStrict: false,
  //     module: 'template-json',
  //     base: '.'
  //   });
  //   grunt.verbose.writeflags(options, "Options");

  //   var counter = 0;
  //   var strict = (options.useStrict) ? '"use strict";\n' : '';

  //   // convert Windows file separator URL path separator
  //   var normalizePath = function(p) {
  //     if ( path.sep !== '/' ) {
  //       p = p.replace(/\\/g, '/');
  //     }
  //     return p;
  //   };

  //   // Warn on and remove invalid source files (if nonull was set).
  //   var existsFilter = function(filepath) {
  //     if (!grunt.file.exists(filepath)) {
  //       grunt.log.warn('Source file "' + filepath + '" not found.');
  //       return false;
  //     } else {
  //       return true;
  //     }
  //   };

  //   var escapeContent = function(content) {
  //     var quoteChar = '\'';
  //     var indentString = '  ';
  //     var bsRegexp = new RegExp('\\\\', 'g');
  //     var quoteRegexp = new RegExp('\\' + quoteChar, 'g');
  //     var nlReplace = '\\n' + quoteChar + ' +\n' + indentString + indentString + quoteChar;
  //     return content.replace(bsRegexp, '\\\\').replace(quoteRegexp, '\\' + quoteChar).replace(/\r?\n/g, nlReplace);
  //   };

  //   // compile a template to an angular module
  //   var compileTemplate = function(moduleName, filepath) {
  //     var content = grunt.file.read(filepath);
  //     var TEMPLATE = '$templateCache.put(\'%s\', \n    \'%s\');\n';
  //     return util.format(TEMPLATE, moduleName, escapeContent(content));
  //   };

  //   // generate a separate module
  //   function generateModule (f) {

  //     // f.dest must be a string or write will fail
  //     var moduleNames = [];
  //     var filePaths = f.src.filter(existsFilter);
  //     var modules = filePaths.map(function(filepath) {
  //       var moduleName = normalizePath(path.relative(options.base, filepath));
  //       moduleNames.push("'" + moduleName + "'");
  //       return compileTemplate(moduleName, filepath);
  //     });

  //     counter += modules.length;
  //     modules  = modules.join('\n');

  //     var targetModule = f.module || options.module;
  //     // jscs: disable
  //     var bundle = "angular.module('" + targetModule + "',
  // []).run(['$templateCache', function($templateCache) {\n" + strict;

  //     modules += '\n}]);\n';

  //     grunt.file.write(f.dest, grunt.util.normalizelf(bundle + modules));
  //   }

  //   this.files.forEach(generateModule);

  //   // Just have one output, so if we making thirty files it only does one line
  //   grunt.log.writeln("Successfully converted " + ("" + counter).green + " json templates to js.");
  //   // jscs: enable
  // });

  //
  // Find unused images
  //
  grunt.registerTask('unusedImages', function() {
    var imgPath = grunt.config('unusedImages.options.imgPath');
    var srcPath = grunt.config('unusedImages.options.srcPath');
    var assets = [],
        links = [];

    // Get list of images
    grunt.file.expand({
      filter: 'isFile',
      cwd: imgPath
    }, ['**/*']).forEach(function(file){
      assets.push(file);
    });

    // Find images in contents
    grunt.file.expand({
      filter: 'isFile',
    }, srcPath).forEach(function(file) {
      var content = grunt.file.read(file);
      assets.forEach(function(asset){
        if (content.search(asset) !== -1) {
          links.push(asset);
        }
      });
    });

    // Output unused images
    var unused = grunt.util._.difference(assets, links);
    console.log('Found ' + unused.length + ' unused images:');
    unused.forEach(function(el){
      console.log(el);
    });
  });

  // Combined Task for building language files from variants
  //
  // grunt.registerTask('i18n', [
  //   // 'merge-json',
  //   'trim-nulls',
  //   // 'json2js'
  // ]);

  // grunt serve
  //
  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'git-revision',
      'gruntClean:serve',
      'index',
      'sass:dev',
      'copy:vendor',
      'copy:generic',
      'copy:variant',
      'concat:styles',
      'purifycss',
      'replace:styles',
      'postcss:dist',
      // 'autoprefixer',
      // 'i18n',
      'html2js',
      'update_docs',
      'ngdocs',
      'connect:livereload',
      'connect:docs',
      'watch'
    ]);
  });

  grunt.registerTask('runBuild', [
    'git-revision',
    'gruntClean:serve',
    'index',
    'copy:vendor',
    'copy:generic',
    'copy:variant',
    // 'sass:dist',
    'sass:dev',
    'concat:styles',
    'replace:styles',
    'postcss:dist',
    // 'autoprefixer',
    // 'i18n',
    'html2js',
    'unusedImages'
  ]);

  grunt.registerTask('runDist', [
    // 'responsive-img'
    'gruntClean:dist',
    'useminPrepare',       // read minification blocks in index.html
    'sass:dev',
    'concat:generated',    // concat JS, CSS
    'cssmin:generated',    // minify CSS
    'uglify:generated',    // minify JS
    'imagemin',            // minify images (do before fielrev, because filename md5 is cut out otherwise)
    'filerev',             // revision image filenames (add MD5 content checksum)
    'usemin',              // concat/minify/post-process JS, JSON, CSS
    'copy:dist',           // copy build targets to dist
    'svgmin',
    'usebanner',           // add banners to CSS files
    'compress',            // compress files with gzip
    'htmlSnapshot',        // create static html snapshots
    'update_docs',         // prepare copying docu scripts
    'ngdocs'               // build documentation from source files
  ]);

  // Development tests
  //
  grunt.registerTask('test', [
    'runBuild',
    'connect:test',          // start internal test webserver
    'karma',                 // run Unit and CI test cases
    'protractor_webdriver',  // start webdriver automatically
    'protractor:run'         // run E2E tests
  ]);

  grunt.registerTask('unittest', [
    'runBuild',
    'connect:test',          // start internal test webserver
    'karma:unit'             // run Unit test cases
  ]);

  // Continuous integration with unit-tests only
  //
  grunt.registerTask('cibuild', [
    'runBuild',
    'connect:test',          // start internal test webserver
    'karma:unit',            // run unit test cases only
    'runDist'
  ]);

  // Continuous integration tests with e2e tests included
  //
  grunt.registerTask('cibuild-e2e', [
    'runBuild',
    'connect:test',          // start internal test webserver
    'karma:unit',            // run unit test cases only
    // 'protractor_webdriver',  // start webdriver automatically
    // 'protractor:run',        // run E2E tests
    'runDist'
  ]);

  // Continuous integration tests with e2e tests included
  //
  grunt.registerTask('cibuild-e2e-staging', [
    'runBuild',
    'connect:test',          // start internal test webserver
    'karma:unit',            // run unit test cases only
    // 'protractor_webdriver',  // start webdriver automatically
    // 'protractor:staging',        // run E2E tests
    'runDist'
  ]);

  // Continuous integration tests with e2e tests included
  //
  grunt.registerTask('e2e-start-cluster', [
    'runBuild',
    'connect:test',          // start internal test webserver
    'karma:unit',            // run unit test cases only
    'protractor_webdriver',  // start webdriver automatically
    'protractor:startCluster'       // run E2E tests
  ]);

  // Continuous integration tests with starting a heatmap cluster
  //
  grunt.registerTask('e2e-start-heatmap', [
    'runBuild',
    'connect:test',          // start internal test webserver
    'karma:unit',            // run unit test cases only
    'protractor_webdriver',  // start webdriver automatically
    'protractor:startHeatmap'       // run E2E tests
  ]);

  // Build without tests
  //
  grunt.registerTask('build', [
    'runBuild',
    'runDist'
  ]);

  // Split up images and reparse all img paths to add srcset attribute
  // (this will significantly increase build time)
  //
  grunt.registerTask('responsive-img', [
    'gruntClean:dist',
    'useminPrepare',       // read minification blocks in index.html
    // 'cssmin:generated',    // minify CSS
    'imagemin',            // minify images (do before fielrev, because filename md5 is cut out otherwise)
    'filerev',             // revision image filenames (add MD5 content checksum)
    'usemin:html_srcset',              // restore filepaths at all html files
    'responsive_images:dist',
    'responsive_images_extender:dist',
    // 'i18n',
    'html2js',
    'useminPrepare',       // read minification blocks in index.html
    'sass:dev',
    'concat:generated',    // concat JS, CSS
    'cssmin:generated',    // minify CSS
    'uglify:generated',    // minify JS
    'usemin',              // concat/minify/post-process JS, JSON, CSS
    'copy:dist',           // copy build targets to dist
    'svgmin',              // copy svg and minimize
    'usebanner',           // add banners to CSS files
    'compress',            // compress files with gzip
    // 'htmlSnapshot',        // create static html snapshots
    'update_docs',         // prepare copying docu scripts
    'ngdocs'               // build documentation from source files
  ]);

  // Standard build with lint, unit and CI tests
  //
  grunt.registerTask('default', [
    'newer:jshint',        // lint changed files
    // 'newer:jscs:src',        // lint changed files
    // 'newer:json-pretty',
    'test'                 // run all test subtasks
  ]);

  // grunt.loadNpmTasks('grunt-json-pretty');
  grunt.loadNpmTasks('grunt-protractor-webdriver');
  grunt.loadNpmTasks('grunt-svgmin');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-html-snapshot');
  grunt.loadNpmTasks('grunt-responsive-images-extender');
  grunt.loadNpmTasks('grunt-purifycss');
};
