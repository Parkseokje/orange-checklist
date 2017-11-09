module.exports = {
  apps: [{
    name: 'orange-checklist',
    script: './bin/www',
    env: {
      "NODE_ENV": "development"
    },
    env_production: {
      "NODE_ENV": "production"
    }
  }],
  deploy: {
    production: {
      user: 'ubuntu',
      host: 'ec2-52-78-245-22.ap-northeast-2.compute.amazonaws.com',
      key: '~/.ssh/orangemanu.pem',
      ref: 'origin/master',
      repo: 'git@github.com:Parkseokje/orange-checklist.git',
      path: '/home/ubuntu/orange-checklist',
      'post-deploy': 'cd ./backend && npm install && pm2 startOrRestart ../ecosystem.config.js --watch'
    }
  }
}