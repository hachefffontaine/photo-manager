const fs = require('fs-extra');
const path = require('path');

const getDirectoryTree = (dirPath) => {
  if (!fs.existsSync(dirPath)) return null;

  const items = fs.readdirSync(dirPath);
  const tree = [];

  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);

    tree.push({
      name: item,
      path: fullPath,
      isDirectory: stat.isDirectory(),
      children: stat.isDirectory() ? getDirectoryTree(fullPath) : null,
    });
  }

  return tree;
};

const getFilesInDirectory = (dirPath) => {
  if (!fs.existsSync(dirPath)) return [];

  const items = fs.readdirSync(dirPath);
  return items.map(item => {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);
    return {
      name: item,
      path: fullPath,
      isDirectory: stat.isDirectory(),
      size: stat.size,
      modified: stat.mtime,
    };
  });
};

const getFile = (path) => {
  // Décode l'URL et remplace les \ par / (indispensable sur Windows)
  let decodedPath = decodeURIComponent(path).replace(/\\/g, '/');

  // Construit le chemin complet
  const fullPath = decodedPath;

  console.log('🔍 Recherche du fichier :', fullPath); // 🔍 Pour déboguer

  // Détermine le type MIME
  const ext = fullPath.split('.').pop()?.toLowerCase();
  const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.mp4': 'video/mp4',
    '.mkv': 'video/x-matroska',
    '.avi': 'video/x-msvideo',
    '.mov': 'video/quicktime',
    '.webm': 'video/webm',
    '.txt': 'text/plain',
    '.md': 'text/markdown',
    '.json': 'application/json',
    '.xml': 'application/xml'
  };

  const mimeType = mimeTypes[ext] || 'application/octet-stream';

  return {
    path: fullPath,
    mimeType: mimeType
  };
};

module.exports = {
  getDirectoryTree,
  getFilesInDirectory,
  getFile
};
