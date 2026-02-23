/**
 * Post-build minification script for 11ty sites
 * 
 * USAGE:
 * 1. Copy this file to your 11ty project root as minify.js
 * 2. Add to package.json devDependencies:
 *    "clean-css": "^5.3.3",
 *    "terser": "^5.27.0"
 * 3. Update package.json build script:
 *    "build": "npx @11ty/eleventy && npm run minify",
 *    "minify": "node minify.js"
 * 4. Run: npm install && npm run build
 * 
 * Minifies all CSS and JS files in _site directory
 */

const fs = require('fs');
const path = require('path');
const CleanCSS = require('clean-css');
const Terser = require('terser');

const SITE_DIR = '_site';

// Recursively find all files with given extensions
function findFiles(dir, extensions) {
  const files = [];
  
  function walk(currentDir) {
    const items = fs.readdirSync(currentDir);
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        walk(fullPath);
      } else if (extensions.some(ext => item.endsWith(ext))) {
        files.push(fullPath);
      }
    }
  }
  
  walk(dir);
  return files;
}

// Minify CSS files
function minifyCSS() {
  const cssFiles = findFiles(SITE_DIR, ['.css']);
  const cleanCSS = new CleanCSS({ level: 2 });
  
  let totalSaved = 0;
  
  for (const file of cssFiles) {
    const original = fs.readFileSync(file, 'utf8');
    const minified = cleanCSS.minify(original);
    
    if (minified.styles) {
      const saved = original.length - minified.styles.length;
      totalSaved += saved;
      fs.writeFileSync(file, minified.styles);
      console.log(`✓ CSS: ${path.relative(SITE_DIR, file)} (saved ${saved} bytes)`);
    }
  }
  
  console.log(`\nTotal CSS savings: ${(totalSaved / 1024).toFixed(2)} KB`);
  return cssFiles.length;
}

// Minify JS files
async function minifyJS() {
  const jsFiles = findFiles(SITE_DIR, ['.js']);
  
  let totalSaved = 0;
  
  for (const file of jsFiles) {
    // Skip already minified files
    if (file.includes('.min.js')) continue;
    
    const original = fs.readFileSync(file, 'utf8');
    
    try {
      const minified = await Terser.minify(original, {
        compress: true,
        mangle: true
      });
      
      if (minified.code) {
        const saved = original.length - minified.code.length;
        totalSaved += saved;
        fs.writeFileSync(file, minified.code);
        console.log(`✓ JS: ${path.relative(SITE_DIR, file)} (saved ${saved} bytes)`);
      }
    } catch (err) {
      console.log(`⚠ JS: ${path.relative(SITE_DIR, file)} - skipped (${err.message})`);
    }
  }
  
  console.log(`\nTotal JS savings: ${(totalSaved / 1024).toFixed(2)} KB`);
  return jsFiles.length;
}

// Main
async function main() {
  console.log('🔧 Minifying CSS and JS files...\n');
  
  const cssCount = minifyCSS();
  console.log('');
  const jsCount = await minifyJS();
  
  console.log(`\n✅ Minification complete: ${cssCount} CSS, ${jsCount} JS files processed`);
}

main().catch(console.error);
