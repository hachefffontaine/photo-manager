const fs = require('fs').promises;
const path = require('path');

const METADATA_FILE = path.join(__dirname, 'metadata.json');

// Charger le fichier metadata.json
async function loadMetadata() {
  try {
    const data = await fs.readFile(METADATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    if (err.code === 'ENOENT') return []; // Fichier inexistant
    console.error('Erreur lecture metadata.json:', err.message);
    return [];
  }
}

// 🔥 Nouvelle fonction de recherche — remplace l’ancienne avec exiftool
async function searchFiles(query) {
  try {
    // Charger les métadonnées
    const metadata = await loadMetadata();

    // Si la requête est vide, retourner tous les fichiers
    if (!query || query.trim() === '') {
      return {
        files: metadata.map(item => ({
          name: path.basename(item.fullPath),
          path: item.fullPath,
          isDirectory: false
        }))
      };
    }

    // Analyser la requête : détecte # et @
    let searchIn = ['fullPath', 'tags', 'personnes']; // recherche dans tout par défaut
    let searchTerm = query.trim();

    if (query.startsWith('#')) {
      searchIn = ['tags'];
      searchTerm = query.slice(1).trim(); // supprime le #
    } else if (query.startsWith('@')) {
      searchIn = ['personnes'];
      searchTerm = query.slice(1).trim(); // supprime le @
    }
    // Sinon : recherche dans les 3 champs (fullPath, tags, personnes)

    // Normaliser la recherche : insensible à la casse
    const lowerSearchTerm = searchTerm.toLowerCase();

    // Filtrer les entrées
    const matchingEntries = metadata.filter(item => {
      return searchIn.some(field => {
        if (field === 'fullPath') {
          return item.fullPath.toLowerCase().includes(lowerSearchTerm);
        } else if (field === 'tags' || field === 'personnes') {
          return Array.isArray(item[field]) && item[field].some(
            term => term.toLowerCase().includes(lowerSearchTerm)
          );
        }
        return false;
      });
    });

    // Formater le résultat demandé
    const files = matchingEntries.map(item => ({
      name: path.basename(item.fullPath),
      path: item.fullPath,
      isDirectory: false
    }));

    return {
      files: files
    };

  } catch (error) {
    console.error('Erreur lors de la recherche :', error.message);
    return {
      files: []
    };
  }
}

// Exporter la fonction
module.exports = { searchFiles };
