const models = require('../models');

const { Account, Slime } = models;

const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
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

  if (!username || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }

    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: '/maker' });
  });
};

const signup = (request, response) => {
  const req = request;
  const res = response;

  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
    };

    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();

    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      res.json({ redirect: '/maker' });
    });

    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).json({ error: 'Username already in use.' });
      }

      return res.status(400).json({ err: 'An error occurred' });
    });
  });
};

const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfJSON);
};

const addResidue = (request, response) => {
  const req = request;
  const res = response;

  Account.AccountModel.findByUsername(req.session.account.username, (err, acc) => {
    const account = acc;
    account.slimeResidue++;
    account.save();

    return res.json({ player: account });
  });
};

const getPlayer = (request, response) => {
  const req = request;
  const res = response;

  Account.AccountModel.findByUsername(req.session.account.username, (err, acc) => res.json(
    { player: acc },
  ));
};

const getEnemy = (request, response) => {
  const req = request;
  const res = response;

  Account.AccountModel.findByUsername(req.session.account.username, (err, acc) => res.json(
    { enemy: acc.currentEnemy },
  ));
};

const combatEnemy = (request, response) => {
  const req = request;
  const res = response;

  Slime.SlimeModel.findById(req.body.id, (err, doc) => {
    if (err) { return res.status(500).json({ err }); }
    if (!doc) { return res.json({ warning: 'Slime not found!' }); }
    const slime = doc;
    Account.AccountModel.findByUsername(req.session.account.username, (err1, acc) => {
      const account = acc;
      if (!account.currentEnemy) {
        return res.status(400).json({ error: 'No Enemy To Fight!' });
      }
      // SLIME PERK KEY

      // 1 - Unit deals damage before taking damage
      // 2 - Unit increases attack when it attacks and survives
      // 3 - Unit deals double damage but takes recoil
      // 4 - Unit less damage but adds residue whenever it attacks

      // ENEMY PERK KEY
      // 1 - Lowers a slimes attack after combat, even if it dies
      // 2 - Damage to slimes under 25% of their health instantly kills them
      // 3 - Heals to full when it kills a slime
      // 4 - Increases it's attack every time it fights

      switch (slime.perk) {
        case 0:
          account.currentEnemy.health -= slime.attack;
          break;
        case 1:
          account.currentEnemy.health -= slime.attack;
          break;
        case 2:
          account.currentEnemy.health -= slime.attack;
          break;
        case 3:
          account.currentEnemy.health -= slime.attack * 2;
          slime.health -= Math.round(slime.attack * 0.25);
          break;
        case 4:
          account.currentEnemy.health -= Math.ceil(slime.attack / 2);
          account.slimeResidue += Math.ceil(slime.max_health / 4) * 5;
          break;

        default:
          break;
      }

      if (account.currentEnemy.perk === 1) {
        slime.attack -= Math.ceil(slime.attack * 0.25);
        if (slime.attack < 1) {
          slime.attack = 0;
        }
      }

      if ((slime.perk === 1 && account.currentEnemy.health > 0) || slime.perk !== 1) {
        switch (account.currentEnemy.perk) {
          case 0:
            slime.health -= account.currentEnemy.attack;
            break;
          case 1:
            slime.health -= account.currentEnemy.attack;
            break;
          case 2:
            if (slime.health <= slime.max_health * 0.25) {
              slime.health = 0;
            }
            break;
          case 3:
            slime.health -= account.currentEnemy.attack;
            if (slime.health <= 0) {
              account.currentEnemy.health = account.currentEnemy.max_health;
            }
            break;
          case 4:
            slime.health -= account.currentEnemy.attack;
            account.currentEnemy.attack += Math.ceil(account.currentEnemy.attack * 0.1);
            break;
          default:
            break;
        }
      }

      if (account.currentEnemy.health <= 0) {
        const value = Math.round(
          (account.currentEnemy.max_health + account.currentEnemy.attack) * 1.5,
        );

        account.gold += Math.round(value / 3);
        slime.exp += Math.ceil(value);
        while (slime.level * 10 <= slime.exp) {
          slime.exp -= slime.level * 10;
          slime.level++;
          slime.attack = Math.ceil(slime.attack * (1.1 + (Math.random() * 0.15)));
          const healthval = (1.1 + (Math.random() * 0.15));
          slime.max_health = Math.ceil(slime.max_health * healthval);
          slime.health += Math.ceil(slime.max_health * 0.1);
        }
        account.currentEnemy = null;
      }

      if (slime.health <= 0) {
        slime.remove();
        const value = Math.round((slime.max_health + slime.attack) * 2);
        account.slimeResidue += value;
      } else {
        slime.save();
      }
      account.markModified('currentEnemy');
      account.save();

      return res.json({ player: account });
    });
    return false;
  });

  return false;
};

const addGold = (request, response) => {
  const req = request;
  const res = response;

  Account.AccountModel.findByUsername(req.session.account.username, (err, acc) => {
    const account = acc;
    account.gold += 50;

    account.save();
    return res.json({ enemy: acc.currentEnemy });
  })
}

const summonEnemy = (request, response) => {
  const req = request;
  const res = response;

  Account.AccountModel.findByUsername(req.session.account.username, (err, acc) => {
    const account = acc;
    if (account.currentEnemy) {
      return res.status(400).json({ error: 'You already have an enemy to fight!' });
    }

    if (account.gold < req.body.wager) {
      return res.status(400).json({ error: 'You need more gold for this wager!' });
    }

    const enemyType = Math.floor(Math.random() * 3);
    const min = Math.floor((1 + parseInt(req.body.wager, 10)) * 0.5);
    const max = Math.ceil((1 + parseInt(req.body.wager, 10)) * 1.5);
    let strength = Math.floor(Math.random() * (max - min) + min);

    if (strength <= 0) {
      strength = 1;
    }

    account.currentEnemy = {
      health: [1, 2, 4][enemyType] * strength,
      max_health: [1, 2, 4][enemyType] * strength,
      name: 'Wayward Wanderer',
      attack: [4, 2, 1][enemyType] * strength,
      perk: Math.floor(Math.random() * 5),
    };

    account.gold -= req.body.wager;

    account.save();

    return res.json({ enemy: acc.currentEnemy });
  });
};

module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signup = signup;
module.exports.addResidue = addResidue;
module.exports.getToken = getToken;
module.exports.getPlayer = getPlayer;
module.exports.getEnemy = getEnemy;
module.exports.summonEnemy = summonEnemy;
module.exports.combatEnemy = combatEnemy;
module.exports.addGold = addGold;
