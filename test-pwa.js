#!/usr/bin/env node

/**
 * PWA Installability Checker
 * Prüft ob die PWA auf Android/iOS installierbar ist
 */

const http = require('http');
const url = require('url');

const HOST = 'localhost';
const PORT = 8000;
const BASE_URL = `http://${HOST}:${PORT}`;

let results = {
  passed: [],
  failed: [],
  warnings: []
};

async function checkUrl(path) {
  return new Promise((resolve) => {
    const urlObj = new URL(path, BASE_URL);
    const req = http.request(urlObj, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });
    req.on('error', (err) => {
      resolve({ status: 0, error: err.message, body: '' });
    });
    req.end();
  });
}

async function runTests() {
  console.log('🔍 PWA Installability Check\n');
  console.log(`Testing: ${BASE_URL}\n`);

  // 1. HTML laden
  console.log('1️⃣  Checking HTML...');
  const html = await checkUrl('/index.html');
  if (html.status === 200) {
    results.passed.push('✅ index.html erreichbar');
    
    // Prüfe auf kritische Meta-Tags
    const checks = [
      { pattern: /rel="manifest"/, name: 'manifest link' },
      { pattern: /name="theme-color"/, name: 'theme-color meta tag' },
      { pattern: /name="viewport"/, name: 'viewport meta tag' },
      { pattern: /name="apple-mobile-web-app-capable"/, name: 'apple-mobile-web-app-capable' },
      { pattern: /name="mobile-web-app-capable"/, name: 'mobile-web-app-capable' },
      { pattern: /serviceWorker.*register/, name: 'Service Worker registration' },
    ];
    
    checks.forEach(check => {
      if (check.pattern.test(html.body)) {
        results.passed.push(`✅ Found: ${check.name}`);
      } else {
        results.failed.push(`❌ Missing: ${check.name}`);
      }
    });
  } else {
    results.failed.push(`❌ index.html nicht erreichbar (Status: ${html.status})`);
  }

  // 2. Manifest laden
  console.log('\n2️⃣  Checking Manifest...');
  const manifest = await checkUrl('/manifest.json');
  if (manifest.status === 200) {
    results.passed.push('✅ manifest.json erreichbar');
    
    try {
      const manifestData = JSON.parse(manifest.body);
      
      // Prüfe Manifest-Inhalte
      const manifestChecks = [
        { key: 'name', name: 'name property' },
        { key: 'short_name', name: 'short_name property' },
        { key: 'start_url', name: 'start_url property' },
        { key: 'display', name: 'display property' },
        { key: 'icons', name: 'icons array' },
      ];
      
      manifestChecks.forEach(check => {
        if (manifestData[check.key]) {
          results.passed.push(`✅ Manifest.${check.name}: ${JSON.stringify(manifestData[check.key]).substring(0, 50)}`);
        } else {
          results.failed.push(`❌ Missing Manifest.${check.name}`);
        }
      });
      
      // Prüfe Icons
      if (Array.isArray(manifestData.icons)) {
        if (manifestData.icons.length === 0) {
          results.failed.push('❌ Keine Icons definiert');
        } else {
          results.passed.push(`✅ Icons defined: ${manifestData.icons.length}`);
          
          // Prüfe auf maskable icons
          const hasMaskable = manifestData.icons.some(i => i.purpose === 'maskable' || i.purpose?.includes('maskable'));
          if (hasMaskable) {
            results.passed.push('✅ Maskable icon found (wichtig für Android)');
          } else {
            results.warnings.push('⚠️  Keine maskable icons definiert (weniger optimal auf Android)');
          }
        }
      }
      
      // Prüfe display mode
      if (manifestData.display === 'standalone') {
        results.passed.push('✅ display mode ist "standalone"');
      } else {
        results.warnings.push(`⚠️  display mode ist "${manifestData.display}", sollte "standalone" sein`);
      }
    } catch (e) {
      results.failed.push(`❌ Manifest JSON invalid: ${e.message}`);
    }
  } else {
    results.failed.push(`❌ manifest.json nicht erreichbar (Status: ${manifest.status})`);
  }

  // 3. Service Worker
  console.log('\n3️⃣  Checking Service Worker...');
  const sw = await checkUrl('/service-worker.js');
  if (sw.status === 200) {
    results.passed.push('✅ service-worker.js erreichbar');
    
    if (sw.body.includes('self.addEventListener')) {
      results.passed.push('✅ Service Worker hat Event Listener');
    }
  } else {
    results.failed.push(`❌ service-worker.js nicht erreichbar (Status: ${sw.status})`);
  }

  // 4. Icons prüfen
  console.log('\n4️⃣  Checking Icons...');
  const icon192 = await checkUrl('/192x192.jpg');
  const icon512 = await checkUrl('/512x512.jpeg');
  
  if (icon192.status === 200) {
    results.passed.push(`✅ 192x192 icon erreichbar (${icon192.headers['content-length']} bytes)`);
  } else {
    results.failed.push('❌ 192x192 icon nicht gefunden');
  }
  
  if (icon512.status === 200) {
    results.passed.push(`✅ 512x512 icon erreichbar (${icon512.headers['content-length']} bytes)`);
  } else {
    results.failed.push('❌ 512x512 icon nicht gefunden');
  }

  // 5. Content-Type Header prüfen
  console.log('\n5️⃣  Checking Content-Type Headers...');
  if (manifest.headers['content-type']?.includes('application/json')) {
    results.passed.push('✅ manifest.json hat korrekten Content-Type');
  } else {
    results.warnings.push(`⚠️  manifest.json Content-Type: ${manifest.headers['content-type']}`);
  }

  if (sw.headers['content-type']?.includes('javascript')) {
    results.passed.push('✅ service-worker.js hat korrekten Content-Type');
  } else {
    results.warnings.push(`⚠️  service-worker.js Content-Type: ${sw.headers['content-type']}`);
  }

  // Zusammenfassung
  console.log('\n' + '='.repeat(60));
  console.log('\n📊 ERGEBNISSE:\n');
  
  console.log(`✅ Passed: ${results.passed.length}`);
  results.passed.forEach(p => console.log(`   ${p}`));
  
  if (results.warnings.length > 0) {
    console.log(`\n⚠️  Warnings: ${results.warnings.length}`);
    results.warnings.forEach(w => console.log(`   ${w}`));
  }
  
  if (results.failed.length > 0) {
    console.log(`\n❌ Failed: ${results.failed.length}`);
    results.failed.forEach(f => console.log(`   ${f}`));
  }

  console.log('\n' + '='.repeat(60));
  
  if (results.failed.length === 0) {
    console.log('\n✨ PWA sollte installierbar sein!');
  } else {
    console.log('\n🔴 PWA hat noch Probleme.');
  }
}

runTests().catch(console.error);
