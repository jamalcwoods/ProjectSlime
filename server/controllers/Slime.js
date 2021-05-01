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
  Account.AccountModel.findByUsername(req.session.account.username,(err,acc) => {
    const account = acc
    if(account.slimeResidue < req.body.residue){
      return res.status(400).json({ error: 'Not enough residue to create this slime' });
    }

    const slimeData = {
      name: req.body.name,
      health: req.body.residue,
      level: 1,
      perk: 0,
      owner: req.session.account._id,
    };
  
    const newSlime = new Slime.SlimeModel(slimeData);
  
    const slimePromise = newSlime.save();
  
    slimePromise.then(() => res.json({ redirect: '/maker' }));
  
    slimePromise.catch((err) => {
      console.log(err);
      if (err.code === 11000) {
        return res.status(400).json({ error: 'Slime already exists.' });
      }
  
      return res.status(400).json({ error: 'An error occured.' });
    });

    
    account.slimeResidue -= req.body.residue;
    account.save();

    return slimePromise;
  })
};



const updateSlime = (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  Slime.SlimeModel.findByName(req.session.account._id, req.body.name, (err, doc) => {
    if (err) { return res.status(500).json({ err }); }
    if (!doc) { return res.json({ warning: 'Slime not found!' }); }
    const tempSlime = doc;
    tempSlime.level++;

    const slimePromise = tempSlime.save();

    slimePromise.then(() => res.json({ redirect: '/maker' }));

    slimePromise.catch((e) => {
      console.log(e);
      return res.status(400).json({ error: 'An error occured.' });
    });

    return slimePromise;
  });

  return false;
};

const updateSlime2 = (req, res) => {
  if (!req.body.name1 || !req.body.name2) {
    return res.status(400).json({ error: 'Both names are required' });
  }

  Slime.SlimeModel.findByName(req.session.account._id, req.body.name1, (err, doc) => {
    if (err) { return res.status(500).json({ err }); }
    if (!doc) { return res.json({ warning: 'Slime 1 not found!' }); }
    const tempSlime1 = doc;
    let slime1Age = tempSlime1.age
    tempSlime1.age++;

    const slimePromise1 = tempSlime1.save()
    
    Slime.SlimeModel.findByName(req.session.account._id, req.body.name2, (err2, doc2) => {
      if (err2) { return res.status(500).json({ err2 }); }
      if (!doc2) { return res.json({ warning: 'Slime 2 not found!' }); }
      const tempSlime2 = doc2;
      tempSlime2.level += slime1Age;

      const slimePromise2 = tempSlime2.save();

      slimePromise2.then(() => res.json({ redirect: '/maker' }));

      slimePromise2.catch((e) => {
        console.log(e);
        return res.status(400).json({ error: 'An error occured.' });
      });

      return slimePromise2;
    })
    return slimePromise1;
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
    console.log(docs)
    return res.json({ slimes: docs });
  });
};

module.exports.makerPage = makerPage;
module.exports.getSlimes = getSlimes;
module.exports.make = makeSlime;
module.exports.update = updateSlime;
module.exports.update2 = updateSlime2;