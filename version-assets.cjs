// Give every script/stylesheet a content-derived URL so returning browsers cannot
// combine a fresh page with an older layout or dependent module.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const file=path.join(__dirname,'index.html'),original=fs.readFileSync(file,'utf8');
const versioned=original.replace(/((?:src|href)=")([^"?]+\.(?:js|css))(?:\?[^" ]*)?(")/g,(_,prefix,asset,suffix)=>{
 const hash=crypto.createHash('sha256').update(fs.readFileSync(path.join(__dirname,asset))).digest('hex').slice(0,12);
 return prefix+asset+'?v='+hash+suffix;
});
if(process.argv.includes('--check')){if(original!==versioned)throw Error('App assets changed: run node version-assets.cjs before publication.');console.log('All app script and stylesheet URLs match their content.');}
else{fs.writeFileSync(file,versioned);console.log('Updated app asset URLs from file contents.');}
