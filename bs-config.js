const {bundle, bundleAll} = require('./build');

let first = true;

module.exports = {
  ui: false,
  ghostMode: false,
  open: false,
  notify: true,
  files: [
    'test/**/*',
    'dist/**/*.js',
    {
      match: ['lib/**/*.+(html|js)'],
      fn() {
        if (first) {
          return;
        }
        bundle();
      }
    },
    {
      match: ['src/styles/*.less'],
      fn() {
        if (first) {
          return;
        }
        bundleAll();
      }
    }
  ],
  server: {
    baseDir: 'test/fixtures',
    routes: {
      '/scripts': `${__dirname}/dist`
    }
  },
  port: 3333,
  browser: 'google chrome',
  injectChanges: true
};

bundleAll().then(() => {
  first = false;
  return;
});
