module.exports = {

  apps : [
    {
      name      : 'Vqua site',
      script    : 'packages/vqua-site/server/index.js'
    }
  ],

  deploy : {
    production : {
      user : 'sterjakov',
      host : '194.67.194.137',
      ref  : 'origin/master',
      repo : 'https://github.com/sterjakovigor/vqua',
      path : '/home/sterjakov/vqua-site',
      'post-deploy' : [
        'npm install',
        'cd packages/vqua-site/ && pm2 reload ecosystem.config.js --env production'
      ].join(' && ')
    },
  }
};