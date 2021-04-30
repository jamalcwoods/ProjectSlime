const models = require('../models');

const { Domo } = models;

const makerPage = (req, res) => {
  Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured.' });
    }
    return res.render('app', { csrfToken: req.csrfToken(), domos: docs });
  });
};

const makeDomo = (req, res) => {
  if (!req.body.name || !req.body.age) {
    return res.status(400).json({ error: 'RAWR! Name and Age all required!' });
  }

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    level: 1,
    owner: req.session.account._id,
  };

  const newDomo = new Domo.DomoModel(domoData);

  const domoPromise = newDomo.save();

  domoPromise.then(() => res.json({ redirect: '/maker' }));

  domoPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists.' });
    }

    return res.status(400).json({ error: 'An error occured.' });
  });

  return domoPromise;
};

const updateDomo = (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ error: 'RAWR! Name is required!' });
  }

  Domo.DomoModel.findByName(req.session.account._id, req.body.name, (err, doc) => {
    if (err) { return res.status(500).json({ err }); }
    if (!doc) { return res.json({ warning: 'Domo not found!' }); }
    const tempDomo = doc;
    tempDomo.level++;

    const domoPromise = tempDomo.save();

    domoPromise.then(() => res.json({ redirect: '/maker' }));

    domoPromise.catch((e) => {
      console.log(e);
      return res.status(400).json({ error: 'An error occured.' });
    });

    return domoPromise;
  });

  return false;
};

const updateDomo2 = (req, res) => {
  if (!req.body.name1 || !req.body.name2) {
    return res.status(400).json({ error: 'RAWR! Both names are required!' });
  }

  Domo.DomoModel.findByName(req.session.account._id, req.body.name1, (err, doc) => {
    if (err) { return res.status(500).json({ err }); }
    if (!doc) { return res.json({ warning: 'Domo 1 not found!' }); }
    const tempDomo1 = doc;
    let domo1Age = tempDomo1.age
    tempDomo1.age++;

    const domoPromise1 = tempDomo1.save()
    
    Domo.DomoModel.findByName(req.session.account._id, req.body.name2, (err2, doc2) => {
      if (err2) { return res.status(500).json({ err2 }); }
      if (!doc2) { return res.json({ warning: 'Domo 2 not found!' }); }
      const tempDomo2 = doc2;
      tempDomo2.level += domo1Age;

      const domoPromise2 = tempDomo2.save();

      domoPromise2.then(() => res.json({ redirect: '/maker' }));

      domoPromise2.catch((e) => {
        console.log(e);
        return res.status(400).json({ error: 'An error occured.' });
      });

      return domoPromise2;
    })
    return domoPromise1;
  });

  return false;
};

const getDomos = (request, response) => {
  const req = request;
  const res = response;

  return Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured.' });
    }

    return res.json({ domos: docs });
  });
};

module.exports.makerPage = makerPage;
module.exports.getDomos = getDomos;
module.exports.make = makeDomo;
module.exports.update = updateDomo;
module.exports.update2 = updateDomo2;