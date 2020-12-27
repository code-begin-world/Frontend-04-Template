var Generator = require('yeoman-generator');

module.exports = class extends (
  Generator
) {
  // The name `constructor` is important here
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);

    // Next, add your custom code
    // this.option('babel'); // This method adds support for a `--babel` flag
  }
  // 文件拷贝
  async copyFiles() {
    this.fs.copyTpl(this.templatePath('index.html'), this.destinationPath('public/index.html'), {
      title: 'Templating with Yeoman'
    });
    this.fs.copyTpl(this.templatePath('HelloWorld.vue'), this.destinationPath('src/HelloWorld.vue'));

    this.fs.copyTpl(this.templatePath('main.js'), this.destinationPath('main.js'));

    this.fs.copyTpl(this.templatePath('webpack.config.js'), this.destinationPath('webpack.config.js'));

    // 测试
    this.fs.copyTpl(this.templatePath('.babelrc'), this.destinationPath('.babelrc'));
    this.fs.copyTpl(this.templatePath('.mocharc.yaml'), this.destinationPath('.mocharc.yaml'));
    this.fs.copyTpl(this.templatePath('.nycrc'), this.destinationPath('.nycrc'));

    this.fs.copy(this.templatePath('test.js'), this.destinationPath('test/test.js'));
  }
  // 依赖安装
  async initPackage() {
    const answers = await this.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Your project name',
        default: this.appname // Default to current folder name
      },
      {
        type: 'confirm',
        name: 'cool',
        message: 'Would you like to enable the Cool feature?'
      }
    ]);

    const pkgJson = {
      name: answers.name,
      version: '1.0.0',
      description: '',
      main: 'main.js',
      scripts: {
        test: 'mocha',
        coverage: 'nyc mocha',
        dev: 'webpack serve',
        build: 'set NODE_ENV=production&& webpack'
      },
      dependencies: {
        // vue: '^2.6.12'
      },
      devDependencies: {
        eslint: '^7.16.0',
        webpack: '^5.6.0',
        'webpack-cli': '^4.2.0',
        'webpack-dev-server': '^3.11.0',
        '@babel/core': '^7.12.7',
        '@babel/preset-env': '^7.12.7',
        'babel-loader': '^8.2.1',
        '@babel/register': '^7.12.10',
        '@istanbuljs/nyc-config-babel': '^3.0.0',
        'babel-plugin-istanbul': '^6.0.0',
        mocha: '^8.2.1',
        nyc: '^15.1.0'
      }
    };
    // Extend or create package.json file in destination path
    this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);
    this.npmInstall();
    this.npmInstall(['vue'], { 'save-dev': false });
    this.npmInstall(['vue-loader', 'vue-template-compiler', 'vue-style-loader', 'css-loader', 'copy-webpack-plugin'], {
      'save-dev': true
    });
  }
};
