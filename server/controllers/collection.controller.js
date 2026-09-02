const Collection = require('../models/Collection');

const getCollections = async (req, res) => {
  try {
    const collections = await Collection.find({});
    res.json(collections);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const createCollection = async (req, res) => {
  try {
    const collection = new Collection({ name: req.body.name, description: req.body.description });
    const created = await collection.save();
    res.status(201).json(created);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const deleteCollection = async (req, res) => {
  try {
    await Collection.findByIdAndDelete(req.params.id);
    res.json({ message: 'Collection removed' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = { getCollections, createCollection, deleteCollection };
