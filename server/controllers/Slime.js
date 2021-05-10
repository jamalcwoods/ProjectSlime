const models = require('../models');

const { Slime, Account } = models;

const makerPage = (req, res) => {
  Slime.SlimeModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured.' });
    }
    return res.render('app', { csrfToken: req.csrfToken(), slimes: docs });
  });
};

const makeSlime = (req, res) => {
  if (!req.body.name || !req.body.residue) {
    return res.status(400).json({ error: 'Name and Residue amount are required' });
  }
  Account.AccountModel.findByUsername(req.session.account.username, (err, acc) => {
    const account = acc;
    if (account.slimeResidue < req.body.residue) {
      return res.status(400).json({ error: 'Not enough residue to create this slime' });
    }

    if (req.body.residue < 2) {
      return res.status(400).json({ error: 'Must give at least 2 residue to create a slime' });
    }

    const rngNum = Math.ceil(Math.random() * (req.body.residue / 2));

    const slimeData = {
      name: req.body.name,
      health: req.body.residue - rngNum,
      max_health: req.body.residue - rngNum,
      attack: rngNum,
      level: 1,
      perk: 0,
      owner: req.session.account._id,
      exp:0
    };

    const newSlime = new Slime.SlimeModel(slimeData);

    const slimePromise = newSlime.save();

    slimePromise.then(() => res.json({ redirect: '/maker' }));

    slimePromise.catch((err2) => {
      console.log(err2);
      if (err2.code === 11000) {
        return res.status(400).json({ error: 'Slime already exists.' });
      }

      return res.status(400).json({ error: 'An error occured.' });
    });

    account.slimeResidue -= req.body.residue;
    account.save();

    return slimePromise;
  });
  return false;
};


const getSlimes = (request, response) => {
  const req = request;
  const res = response;

  return Slime.SlimeModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured.' });
    }
    return res.json({ slimes: docs });
  });
};

const addPerk = (request,response) => {
  const req = request;
  const res = response;

  Account.AccountModel.findByUsername(req.session.account.username, (err1, acc) => {
    const account = acc;
    if (account.gold < 20) {
      return res.status(400).json({ error: 'Not enough gold to randomize perk!' });
    }
    Slime.SlimeModel.findById(req.body.id, (err, doc) => {
      const slime = doc;
      slime.perk = Math.ceil(Math.random() * 4);
    
      account.gold -= 20

      account.save()
      slime.save();

      return res.json({ slime: slime });
    })
  })
}

module.exports.makerPage = makerPage;
module.exports.getSlimes = getSlimes;
module.exports.make = makeSlime;
module.exports.addPerk = addPerk;