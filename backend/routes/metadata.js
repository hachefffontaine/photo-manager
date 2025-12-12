const express = require('express');
const router = express.Router();
const { updateMetadata } = require('../controllers/metadataCtrl');

router.post('/update', async (req, res) => {
  const { filePath, tags, person } = req.body;

  if (!filePath) return res.status(400).json({ error: 'filePath requis' });

  try {
    const result = await updateMetadata(filePath, tags, person);
    res.json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
