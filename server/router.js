const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getSlimes', mid.requiresLogin, controllers.Slime.getSlimes);
  app.get('/login', mid.requiesSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiesSecure, mid.requiresLogout, controllers.Account.login);
  app.get('/getToken', mid.requiesSecure, controllers.Account.getToken);
  app.post('/signup', mid.requiesSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/maker', mid.requiresLogin, controllers.Slime.makerPage);
  app.post('/maker', mid.requiresLogin, controllers.Slime.make);
  app.get('/getPlayer', mid.requiresLogin, controllers.Account.getPlayer);
  app.post('/addResidue', mid.requiresLogin, controllers.Account.addResidue);
  app.post('/update', mid.requiresLogin, controllers.Slime.update);
  app.post('/update2', mid.requiresLogin, controllers.Slime.update2);
  app.get('/', mid.requiesSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;