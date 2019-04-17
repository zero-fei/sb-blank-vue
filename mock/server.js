const args = process.argv.slice(2);
const { fork } = require('child_process');
const chokidar = require('chokidar');

let proc = fork(require.resolve('./_server.js'), args, {
  stdio: 'inherit'
});

function restart() {
  proc.kill();
  proc = fork(require.resolve('./_server.js'), args, {
    stdio: 'inherit'
  });
}

let { watch } = process.env;
const npmConfigArgv = process.env.npm_config_argv;
if (npmConfigArgv) {
  try {
    const config = JSON.parse(npmConfigArgv);
    const argv = config.original || [];
    if (argv.indexOf('--watch') >= 2) {
      watch = true;
    }
  } catch (e) {
    console.info(e);  // eslint-disable-line
  }
}

if (watch) {
  chokidar
    .watch('.', {
      ignoreInitial: true
    })
    .on('all', () => {
      setTimeout(restart, 100);
    });
}
