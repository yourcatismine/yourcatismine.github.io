const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;
const DB = path.join(__dirname, 'likes.json');

app.use(cors());
app.use(bodyParser.json());

function readDb(){
  try{ return JSON.parse(fs.readFileSync(DB, 'utf8') || '{}'); }catch(e){ return {}; }
}
function writeDb(obj){
  try{ fs.writeFileSync(DB, JSON.stringify(obj, null, 2), 'utf8'); return true; }catch(e){ return false; }
}

// GET count
app.get('/api/likes/:id', (req, res)=>{
  const id = req.params.id;
  const db = readDb();
  const entry = db[id] || { count: 0 };
  res.json({ count: entry.count });
});

// POST toggle
app.post('/api/likes/:id', (req, res)=>{
  const id = req.params.id;
  const liked = !!req.body.liked;
  const db = readDb();
  const entry = db[id] || { count: 0 };
  if(liked){ entry.count = (entry.count || 0) + 1; }
  else { entry.count = Math.max(0, (entry.count || 0) - 1); }
  db[id] = entry;
  const ok = writeDb(db);
  if(!ok) return res.status(500).json({ error: 'failed' });
  res.json({ count: entry.count });
});

app.listen(PORT, ()=> console.log('Likes server listening on', PORT));
