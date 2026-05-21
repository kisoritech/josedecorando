const { spawn } = require('child_process');

const env = Object.fromEntries(
  Object.entries(process.env).filter(([key, value]) => key && !key.startsWith('=') && value !== undefined)
);

env.EXPO_NO_DEPENDENCY_VALIDATION = '1';

const command = process.execPath;
const args = [require.resolve('expo/bin/cli'), 'start', ...process.argv.slice(2)];

const child = spawn(command, args, {
  stdio: 'inherit',
  env,
  shell: false,
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code || 0);
});
