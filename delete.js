const fs = require('fs');
const path = require('path');

const directoriesToDelete = ['models', 'routes', 'controllers', 'test'];
const filesToDelete = ['app.js', '.env'];

directoriesToDelete.forEach(dir => {
    if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true, force: true });
        console.log(`Deleted directory: ${dir}`);
    }
});

filesToDelete.forEach(file => {
    if (fs.existsSync(file)) {
        fs.unlinkSync(file);
        console.log(`Deleted file: ${file}`);
    }
});

console.log('Cleanup completed.');
