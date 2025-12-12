const express = require('express');
const cors = require('cors');
const path = require('path');

const filesystemRoutes = require('./routes/filesystem');
const metadataRoutes = require('./routes/metadata');
const searchRoutes = require('./routes/search');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/filesystem', filesystemRoutes);
app.use('/api/metadata', metadataRoutes);
app.use('/api/search', searchRoutes);

// Serveur static pour Angular (optionnel pour déployer ensemble)
app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur Node.js démarré sur http://localhost:${PORT}`);
});