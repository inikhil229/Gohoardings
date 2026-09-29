module.exports = {
  apps: [{
    name: 'gohoardings',
    script: 'node_modules/.bin/next',
    args: 'start -p 3000',
    interpreter: '/root/.nvm/versions/node/v16.20.2/bin/node',
    cwd: '/var/www/new_goh',
    env: {
      NODE_ENV: 'production'
    }
  }]
}
