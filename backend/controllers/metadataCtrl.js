const fs = require('fs').promises;
const path = require('path');

const METADATA_FILE = path.join(__dirname, 'metadata.json');

// Fonction utilitaire : encoder un chemin en Base64 + URL-encode
function encodePath(fullPath) {
  return encodeURIComponent(Buffer.from(fullPath).toString('base64'));
}

// Charger le fichier metadata.json (ou créer un tableau vide)
async function loadMetadata() {
  try {
    const data = await fs.readFile(METADATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    if (err.code === 'ENOENT') return []; // Fichier inexistant → vide
    console.error('Erreur lecture metadata.json:', err.message);
    return [];
  }
}

// Sauvegarder le tableau de métadonnées
async function saveMetadata(metadata) {
  await fs.writeFile(METADATA_FILE, JSON.stringify(metadata, null, 2), 'utf8');
}

// 🔥 NOUVELLE VERSION DE updateMetadata — MÊME SIGNATURE, PAS D’EXIFTOOL
async function updateMetadata(filePath, tags, person) {
  try {
    // Charger les métadonnées existantes
    let metadata = await loadMetadata();

    // Calculer l'ID (base64 + urlencoded du filePath)
    const id = encodePath(filePath);

    // Trouver ou créer l'entrée
    let entry = metadata.find(item => item.id === id);

    if (!entry) {
      // Créer une nouvelle entrée si elle n'existe pas
      entry = {
        id: id,
        fullPath: filePath,
        tags: [],
        personnes: []
      };
      metadata.push(entry);
    }

    // Mettre à jour les tags si fournis
    if (tags !== undefined && tags !== null) {
      // On suppose que `tags` est une chaîne ou un tableau
      if (typeof tags === 'string') {
        entry.tags = tags.split(',').map(t => t.trim()).filter(t => t.length > 0);
      } else if (Array.isArray(tags)) {
        entry.tags = tags.filter(t => t && typeof t === 'string');
      } else {
        entry.tags = []; // Si type invalide, on vide
      }
    }

    // Mettre à jour les personnes si fournies
    if (person !== undefined && person !== null) {
      if (typeof person === 'string') {
        entry.personnes = person.split(',').map(p => p.trim()).filter(p => p.length > 0);
      } else if (Array.isArray(person)) {
        entry.personnes = person.filter(p => p && typeof p === 'string');
      } else {
        entry.personnes = [];
      }
    }

    // Sauvegarder les changements
    await saveMetadata(metadata);

    // Retourner le même format que l’ancienne fonction
    return {
      success: true,
      stdout: `Metadata updated for: ${filePath}`,
      stderr: '' // Pas d'erreur
    };

  } catch (error) {
    return {
      success: false,
      error: error.message,
      stderr: error.stack || error.toString()
    };
  }
}

module.exports = { updateMetadata };
