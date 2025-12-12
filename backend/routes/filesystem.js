const express = require('express');
const fs = require('fs-extra');
const router = express.Router();
const { getDirectoryTree, getFilesInDirectory, getFile } = require('../controllers/filesystemCtrl');

// Récupérer l'arborescence complète
router.get('/tree', (req, res) => {
  const basePath = req.query.basePath || 'C:/Users/hufontaine/OneDrive - Sopra Steria/Pictures';
  try {
    const tree = getDirectoryTree(basePath);
    res.json({ tree });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Récupérer le contenu d’un dossier spécifique
router.get('/content', (req, res) => {
  const dirPath = req.query.path;
  if (!dirPath) return res.status(400).json({ error: 'Paramètre path manquant' });

  try {
    const files = getFilesInDirectory(dirPath);
    res.json({ files });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Récupérer le contenu d’un dossier spécifique
router.get('/file', (req, res) => {
  const path = req.query.path;
  if (!path) return res.status(400).json({ error: 'Paramètre path manquant' });

  // Vérifie si le fichier existe
  if (!fs.existsSync(path)) {
    return res.status(404).json({ error: 'Fichier non trouvé', path: path });
  }

  // Vérifie si c'est bien un fichier (pas un dossier)
  if (!fs.statSync(path).isFile()) {
    return res.status(400).json({ error: 'Le chemin spécifié n\'est pas un fichier' });
  }

  const objectFile = getFile( path );

  // Envoie le fichier en réponse HTTP
  res.setHeader('Content-Type', objectFile.mimeType);
  res.sendFile(objectFile.path, (err) => {
    if (err) {
      console.error('❌ Erreur lors de l\'envoi du fichier :', err);
      res.status(500).json({ error: 'Erreur serveur lors de l\'envoi du fichier' });
    }
  });
});

module.exports = router;
