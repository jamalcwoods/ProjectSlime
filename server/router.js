const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getDomos', mid.requiresLogin, controllers.Domo.getDomos);
  app.get('/login', mid.requiesSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiesSecure, mid.requiresLogout, controllers.Account.login);
  app.get('/getToken', mid.requiesSecure, controllers.Account.getToken);
  app.post('/signup', mid.requiesSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/maker', mid.requiresLogin, controllers.Domo.makerPage);
  app.post('/maker', mid.requiresLogin, controllers.Domo.make);
  app.post('/update', mid.requiresLogin, controllers.Domo.update);
  app.post('/update2', mid.requiresLogin, controllers.Domo.update2);
  app.get('/', mid.requiesSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;