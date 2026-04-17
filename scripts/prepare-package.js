import fs from 'fs';
import path from 'path';

/**
 * preparation script for Adobe UXP packaging
 * Gathers all built assets and UXP-specific files into a /release folder
 */

const __dirname = path.resolve();
const releaseDir = path.join(__dirname, 'release');
const distDir = path.join(__dirname, 'dist');

// 1. Create/Clear release folder
if (fs.existsSync(releaseDir)) {
    fs.rmSync(releaseDir, { recursive: true });
}
fs.mkdirSync(releaseDir);

// 2. Copy Vite build output (the web app)
// We copy contents of dist/ to release/
if (fs.existsSync(distDir)) {
    copyRecursiveSync(distDir, releaseDir);
}

// 3. Copy UXP Manifest (Optional but kept for dual support)
if (fs.existsSync(path.join(__dirname, 'manifest.json'))) {
    fs.copyFileSync(
        path.join(__dirname, 'manifest.json'),
        path.join(releaseDir, 'manifest.json')
    );
}

// 4. Copy CEP Manifest (Critical for PPRO 2023 Extension Tab)
const csxsDir = path.join(__dirname, 'CSXS');
if (fs.existsSync(csxsDir)) {
    fs.mkdirSync(path.join(releaseDir, 'CSXS'));
    copyRecursiveSync(csxsDir, path.join(releaseDir, 'CSXS'));
}

// 5. Copy dev debug file (Critical for unsigned loading)
const debugFile = path.join(__dirname, '.debug');
if (fs.existsSync(debugFile)) {
    fs.copyFileSync(debugFile, path.join(releaseDir, '.debug'));
}

// 6. Copy ExtendScript logic (Host side)
const srcExtendScript = path.join(__dirname, 'src', 'extendscript.js');
if (fs.existsSync(srcExtendScript)) {
    // We check if we need to put it in a specific folder, but root is fine for simple plugins
    fs.copyFileSync(srcExtendScript, path.join(releaseDir, 'extendscript.js'));
}

// 5. Copy extra assets if any (icons, etc)
// Add icon copying here if you have an icons folder
const iconsDir = path.join(__dirname, 'icons');
if (fs.existsSync(iconsDir)) {
    fs.mkdirSync(path.join(releaseDir, 'icons'));
    copyRecursiveSync(iconsDir, path.join(releaseDir, 'icons'));
}

console.log('✅ SilenceX release folder prepared successfully.');
console.log('📁 Location: /release');

/**
 * Helper to copy directories recursively
 */
function copyRecursiveSync(src, dest) {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();
    if (isDirectory) {
        if (!fs.existsSync(dest)) fs.mkdirSync(dest);
        fs.readdirSync(src).forEach((childItemName) => {
            copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
        });
    } else {
        fs.copyFileSync(src, dest);
    }
}
