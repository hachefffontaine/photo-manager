const express = require('express');
const router = express.Router();
const { searchFiles } = require('../controllers/searchCtrl');

router.get('/', async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: 'Paramètre q requis' });

  try {
    const result = await searchFiles(query);
    res.json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
