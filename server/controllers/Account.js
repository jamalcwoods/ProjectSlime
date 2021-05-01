const { request, response } = require('express');
const models = require('../models')

const Account = models.Account;

const loginPage = (req, res) => {
  res.render('login', {csrfToken: req.csrfToken() });
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (request, response) => {
  const req = request;
  const res = response;

  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if(!username || !password){
    return res.status(400).json({error: 'All fields are required'});
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if(err || !account){
      return res.status(401).json({error: 'Wrong username or password'})
    }

    req.session.account = Account.AccountModel.toAPI(account)

    return res.json({redirect: '/maker'})
  })
};



const signup = (request, response) => {
  const req = request;
  const res = response

  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2){
    return res.status(400).json({ error: 'All fields are required'});
  }

  if(req.body.pass !== req.body.pass2){
    return res.status(400).json({ error: 'Passwords do not match'});
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt,hash) =>{
    const accountData = {
      username: req.body.username,
      salt, 
      password: hash,
    };

    const newAccount = new Account.AccountModel(accountData)

    const savePromise = newAccount.save();

    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount)
      res.json({redirect: '/maker' });
    })

    savePromise.catch((err) => {
      console.log(err)

      if(err.code === 11000){
        return res.status(400).json({error: 'Username already in use.'})
      }

      return res.status(400).json({err: 'An error occurred'})
    })
  })
};

const getToken = (request, response) => {
  const req = request; 
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfJSON)
}

const addResidue = (request, response) => {
  const req = request;
  const res = response

  Account.AccountModel.findByUsername(req.session.account.username,(err,acc) => {
    const account = acc
    account.slimeResidue++;
    account.save();

    return res.json({ player: account });
  })
}

const getPlayer = (request, response) => {
  const req = request;
  const res = response

  Account.AccountModel.findByUsername(req.session.account.username,(err,acc) => {
    return res.json({ player: acc });
  })
}

const getEnemy = (request, response) => {
  const req = request;
  const res = response

  Account.AccountModel.findByUsername(req.session.account.username,(err,acc) => {
    return res.json({ enemy: acc.currentEnemy});
  })
}

const summonEnemy = (request, response) => {
  const req = request;
  const res = response

  Account.AccountModel.findByUsername(req.session.account.username,(err,acc) => {
    const account = acc;
    if(account.currentEnemy){
      return res.status(400).json({error: 'You already have an enemy to fight!'});
    }

    let enemyType = Math.floor(Math.random() * 3)
    let min = Math.floor((1 + parseInt(req.body.wager)) * 0.5)
    let max = Math.ceil((1 + parseInt(req.body.wager)) * 1.5)
    let strength = Math.floor(Math.random() * (max - min) + min)
    
    console.log(strength)
    
    if(strength <= 0){
      strength = 1
    }
    
    account.currentEnemy = {
      "health":[1,2,4][enemyType] * strength,
      "max_health":[1,2,4][enemyType] * strength,
      "name":"Wayward Wanderer",
      "attack":[4,2,1][enemyType] * strength,
    }

    account.save();
    

    return res.json({ enemy: acc.currentEnemy});
  })
}

module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signup = signup;
module.exports.addResidue = addResidue
module.exports.getToken = getToken;
module.exports.getPlayer = getPlayer
module.exports.getEnemy = getEnemy;
module.exports.summonEnemy = summonEnemy;