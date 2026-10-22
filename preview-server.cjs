// Local prototype preview. The only write endpoint stores image-review markers.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const types = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.png': 'image/png' };
function createPreviewServer({ reviewFile = path.join(root, 'review-markers.json'), stationFile = path.join(root, 'station-calibration.json'), forwardShelfFile=path.join(root,'forward-shelf-regions.json'), rampShelfFile=path.join(root,'ramp-shelf-regions.json'), portOverheadFile=path.join(root,'port-overhead-regions.json'), stbdOverheadFile=path.join(root,'stbd-overhead-regions.json') } = {}) {
return http.createServer((req, res) => {
  try {
    const name = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if(['/api/forward-shelf-regions','/api/ramp-shelf-regions','/api/port-overhead-regions','/api/stbd-overhead-regions'].includes(name)){
      const side=name==='/api/port-overhead-regions'?'port':name==='/api/stbd-overhead-regions'?'stbd':null;
      const isRamp=name==='/api/ramp-shelf-regions',regionFile=side?(side==='port'?portOverheadFile:stbdOverheadFile):isRamp?rampShelfFile:forwardShelfFile,globalName=side?'CH149_'+side.toUpperCase()+'_OVERHEAD_REGIONS':isRamp?'CH149_RAMP_SHELF_REGIONS':'CH149_FORWARD_SHELF_REGIONS';
      const json=(code,value)=>{res.writeHead(code,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(value));};
      const source=side?{file:side==='port'?'images/PTA View Port.png':'images/Team member View STBD.png',width:2880,height:1620,sha256:side==='port'?'51E14F5CEB4EA7002FA6FF63B5C7F1914219BA0A872CDF89B5AA2A095EB8BD92':'62749733EE2572BBF6F9C9D23ADFC6EED66D98A8E191C4C1E87E85A1C2E0F110'}:isRamp?{file:'images/Rear Shelves.png',width:2880,height:1620,sha256:'1F5873531DD673F0BBB46C57976814B1C0307D4BE43D36D3EEAD32CCAAC8C350'}:{file:'images/Bay 1 Shelves and Sensor WS.png',width:2880,height:1620,sha256:'EE75084733AF20AFB938B443EC7142C370220470AC8AF16A4BFC1613D5D9259A'};
      const ids=side?['OVERHEAD_'+side.toUpperCase()]:isRamp?['RAMP_PORT_FWD','RAMP_PORT_AFT','RAMP_STBD_FWD','RAMP_STBD_AFT']:['PORT_FWD_SHELF_TOP','PORT_FWD_SHELF_MID','PORT_FWD_SHELF_BOT','PORT_FWD_SHELF__FLOOR'];
      const current=()=>fs.existsSync(regionFile)?JSON.parse(fs.readFileSync(regionFile,'utf8')):{schema:1,source,regions:{},revision:0};
      if(req.method==='GET'){json(200,current());return;}
      if(req.method!=='POST'){json(405,{error:'Unsupported action'});return;}
      if(req.headers['content-type']!=='application/json'||req.headers.origin!=='http://'+req.headers.host){json(403,{error:'Same-origin JSON required'});return;}
      let body='',size=0;req.on('data',chunk=>{size+=chunk.length;if(size<=50000)body+=chunk;});req.on('end',()=>{try{
        if(size>50000){json(413,{error:'Review too large'});return;}const data=JSON.parse(body);
        if(data.schema!==1||!data.source||Object.keys(source).some(key=>data.source[key]!==source[key])||!data.regions||typeof data.regions!=='object'||Array.isArray(data.regions)||Object.keys(data.regions).some(id=>!ids.includes(id))){json(400,{error:'Invalid review source or locations'});return;}
        const regions={};for(const [id,record]of Object.entries(data.regions)){const points=record?.points;
          if(record.locationId!==id||!Array.isArray(points)||points.length<3||points.length>40||!points.every(p=>Array.isArray(p)&&p.length===2&&p.every(n=>Number.isFinite(n)&&n>=0&&n<=1))||Math.abs(points.reduce((sum,p,i)=>{const q=points[(i+1)%points.length];return sum+p[0]*q[1]-q[0]*p[1];},0))<=.00001){json(400,{error:'Invalid region outline'});return;}
          regions[id]={locationId:id,points,sourcePoints:points.map(([x,y])=>[x*source.width,y*source.height]),review:'user-outlined visible region',updatedAt:record.updatedAt&&Number.isFinite(Date.parse(record.updatedAt))?new Date(record.updatedAt).toISOString():new Date().toISOString()};
        }
        const previous=current();if(data.expectedRevision!==(previous.revision||0)){json(409,{error:'A newer review exists'});return;}
        const clean={schema:1,source,regions,revision:(previous.revision||0)+1,updatedAt:new Date().toISOString()};
        if(previous.revision)fs.writeFileSync(regionFile+'.previous.json',JSON.stringify(previous,null,2));
        fs.writeFileSync(regionFile+'.tmp',JSON.stringify(clean,null,2));fs.renameSync(regionFile+'.tmp',regionFile);
        const displayFile=regionFile.replace(/\.json$/i,'.js');if(displayFile!==regionFile)fs.writeFileSync(displayFile,'window.'+globalName+'='+JSON.stringify(clean)+';\n');json(200,clean);
      }catch{json(400,{error:'Could not save review'});}});return;
    }
    if(name==='/api/station-calibration') {
      const json=(code,data)=>{res.writeHead(code,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(data));};
      const current=()=>fs.existsSync(stationFile)?JSON.parse(fs.readFileSync(stationFile,'utf8')):null;
      if(req.method==='GET'){json(200,current());return;}
      if(req.method!=='POST'){json(405,{error:'Unsupported action'});return;}
      if(req.headers['content-type']!=='application/json'||req.headers.origin!=='http://'+req.headers.host){json(403,{error:'Same-origin JSON required'});return;}
      let body='',size=0;req.on('data',chunk=>{size+=chunk.length;if(size<=25000)body+=chunk;});
      req.on('end',()=>{try{
        if(size>25000){json(413,{error:'Calibration too large'});return;}
        const data=JSON.parse(body),keys=['BASELINE','SAR3','SAR10','TRANSPORT','CASEVAC'];
        if(data.schema!==1||JSON.stringify(data.plane)!=='[2560,1216]'||!Number.isFinite(data.forward)||!Number.isFinite(data.aft)||data.forward<0||data.aft>2560||data.forward>=data.aft||!keys.includes(data.source)){json(400,{error:'Invalid calibration'});return;}
        const previous=current();if(data.expectedRevision!==(previous?.revision||0)){json(409,{error:'A newer calibration is saved. Reload it before saving.'});return;}
        const legacyRecords={};
        for(const [key,record] of Object.entries(data.legacyRecords||{})){
          if(!keys.includes(key)||!Array.isArray(record.size)||record.size.length!==2||!record.size.every(n=>Number.isFinite(n)&&n>0&&n<=10000)||typeof record.file!=='string'||!/^images\/[\w .-]+\.png$/.test(record.file))continue;
          const clean={file:record.file,size:record.size};
          for(const end of ['forward','aft'])if(Number.isFinite(record[end])&&record[end]>=0&&record[end]<=record.size[0])clean[end]=record[end];
          legacyRecords[key]=clean;
        }
        const clean={schema:1,plane:[2560,1216],forward:data.forward,aft:data.aft,source:data.source,legacyRecords,revision:(previous?.revision||0)+1,updatedAt:new Date().toISOString()};
        if(previous)fs.writeFileSync(stationFile+'.previous.json',JSON.stringify(previous,null,2));
        const scriptFile=stationFile.replace(/\.json$/i,'')+'.js',embedded={schema:clean.schema,plane:clean.plane,forward:clean.forward,aft:clean.aft,source:clean.source,revision:clean.revision};
        fs.writeFileSync(scriptFile+'.tmp','/* Approved shared display calibration; kept in sync by the preview save service. */\nwindow.CH149_STATION_CALIBRATION = '+JSON.stringify(embedded,null,2)+';\n');
        fs.writeFileSync(stationFile+'.tmp',JSON.stringify(clean,null,2));fs.renameSync(scriptFile+'.tmp',scriptFile);fs.renameSync(stationFile+'.tmp',stationFile);json(200,clean);
      }catch{json(400,{error:'Could not save calibration'});}});return;
    }
    if (name === '/api/review-markers') {
      const json = (code, data) => { res.writeHead(code, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(data)); };
      if (req.method === 'GET') {
        const data = fs.existsSync(reviewFile) ? JSON.parse(fs.readFileSync(reviewFile, 'utf8')) : { schema: 1, source: 'images/SAR_3_Pax.png', nextNumber: 1, selected: null, markers: [] };
        json(200, data); return;
      }
      if (req.method !== 'POST') { json(405, { error: 'Unsupported action' }); return; }
      if (req.headers['content-type'] !== 'application/json' || (req.headers.origin && req.headers.origin !== 'http://' + req.headers.host)) { json(403, { error: 'Same-origin JSON required' }); return; }
      let body = '', size = 0;
      req.on('data', chunk => { size += chunk.length; if (size <= 250000) body += chunk; });
      req.on('end', () => {
        try {
          if (size > 250000) { json(413, { error: 'Review too large' }); return; }
          const data = JSON.parse(body), numbers = new Set();
          const valid = data.schema === 1 && data.source === 'images/SAR_3_Pax.png' && Array.isArray(data.markers) && data.markers.length <= 100 &&
            Number.isSafeInteger(data.nextNumber) && data.nextNumber > 0 && data.markers.every(item => {
              if (!Number.isSafeInteger(item.number) || item.number < 1 || item.number >= data.nextNumber || numbers.has(item.number)) return false;
              numbers.add(item.number);
              return Number.isFinite(item.x) && item.x >= 0 && item.x <= 1 && Number.isFinite(item.y) && item.y >= 0 && item.y <= 1 &&
                typeof item.name === 'string' && item.name.length <= 100 && typeof item.notes === 'string' && item.notes.length <= 1500 &&
                ['unknown', 'equipment', 'structure', 'location'].includes(item.kind) && ['unreviewed', 'keep', 'remove', 'location'].includes(item.decision);
            }) && (data.selected === null || numbers.has(data.selected));
          if (!valid) { json(400, { error: 'Invalid marker review' }); return; }
          // Store only the reviewed fields, never caller-supplied paths or metadata.
          const clean = { schema: 1, source: data.source, nextNumber: data.nextNumber, selected: data.selected, updatedAt: new Date().toISOString(), markers: data.markers.map(({ number, x, y, name, kind, decision, notes }) => ({ number, x, y, name, kind, decision, notes })) };
          fs.writeFileSync(reviewFile + '.tmp', JSON.stringify(clean, null, 2));
          fs.renameSync(reviewFile + '.tmp', reviewFile);
          json(200, { saved: true });
        } catch { json(400, { error: 'Could not save review' }); }
      });
      return;
    }
    if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405).end(); return; }
    const file = path.resolve(root, '.' + (name === '/' ? '/index.html' : name));
    if (!file.startsWith(root + path.sep) || !['.html', '.js', '.css', '.png'].includes(path.extname(file))) {
      res.writeHead(404).end(); return;
    }
    const body = fs.readFileSync(file);
    res.writeHead(200, { 'Content-Type': types[path.extname(file)], 'Cache-Control': 'no-store' });
    res.end(body);
  } catch { res.writeHead(404).end(); }
});
}
module.exports = { createPreviewServer };
if (require.main === module) createPreviewServer().listen(Number(process.argv[2]) || 0, '127.0.0.1', function () {
  console.log('Prototype preview: http://127.0.0.1:' + this.address().port);
});
