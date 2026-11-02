import fs from 'fs';
const key = fs.readFileSync(process.argv[2],'utf8').match(/ELEVENLABS_API_KEY=(.*)/)[1].trim().replace(/^"|"$/g,'');
for (const f of process.argv.slice(3)) {
  const fd = new FormData();
  fd.append('model_id','scribe_v1'); fd.append('tag_audio_events','false');
  fd.append('file', new Blob([fs.readFileSync(f)]), f.split('/').pop());
  const r = await fetch('https://api.elevenlabs.io/v1/speech-to-text',{method:'POST',headers:{'xi-api-key':key},body:fd});
  const j = await r.json();
  const words=(j.words||[]).filter(w=>w.type==='word').map(w=>`${w.start.toFixed(1)}:${w.text}`);
  console.log(f.split('/').pop(), j.language_code, '|', words.join(' ') || j.text || JSON.stringify(j).slice(0,200));
}
