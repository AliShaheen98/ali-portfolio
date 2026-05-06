require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'portfolio.json');
const JWT_SECRET = process.env.JWT_SECRET || 'secret_change_this';

// ── Middleware ──
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── Helpers ──
const readData = () => JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
const writeData = (data) => fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

// ── Auth Middleware ──
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// ════════════════════════════════
//  PUBLIC API
// ════════════════════════════════

// Get all portfolio data
app.get('/api/portfolio', (req, res) => {
  res.json(readData());
});

// Get specific section
app.get('/api/portfolio/:section', (req, res) => {
  const data = readData();
  const section = req.params.section;
  if (!data[section]) return res.status(404).json({ error: 'Section not found' });
  res.json(data[section]);
});

// ════════════════════════════════
//  AUTH
// ════════════════════════════════

app.post('/api/login', async (req, res) => {
  const { password } = req.body;
  const adminPass = process.env.ADMIN_PASSWORD || 'admin123';
  
  if (password !== adminPass) {
    return res.status(401).json({ error: 'Wrong password' });
  }
  
  const token = jwt.sign({ admin: true }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token, message: 'Login successful' });
});

// ════════════════════════════════
//  ADMIN API (Protected)
// ════════════════════════════════

// Update profile
app.put('/api/admin/profile', auth, (req, res) => {
  const data = readData();
  data.profile = { ...data.profile, ...req.body };
  writeData(data);
  res.json({ success: true, profile: data.profile });
});

// Update stats
app.put('/api/admin/stats', auth, (req, res) => {
  const data = readData();
  data.profile.stats = req.body;
  writeData(data);
  res.json({ success: true });
});

// Update tags
app.put('/api/admin/tags', auth, (req, res) => {
  const data = readData();
  data.profile.tags = req.body;
  writeData(data);
  res.json({ success: true });
});

// ── SKILLS ──
app.get('/api/admin/skills', auth, (req, res) => {
  res.json(readData().skills);
});
app.put('/api/admin/skills', auth, (req, res) => {
  const data = readData();
  data.skills = req.body;
  writeData(data);
  res.json({ success: true });
});
app.post('/api/admin/skills', auth, (req, res) => {
  const data = readData();
  data.skills.push(req.body);
  writeData(data);
  res.json({ success: true, skills: data.skills });
});
app.delete('/api/admin/skills/:index', auth, (req, res) => {
  const data = readData();
  data.skills.splice(parseInt(req.params.index), 1);
  writeData(data);
  res.json({ success: true });
});

// ── EXPERIENCE ──
app.get('/api/admin/experience', auth, (req, res) => {
  res.json(readData().experience);
});
app.put('/api/admin/experience', auth, (req, res) => {
  const data = readData();
  data.experience = req.body;
  writeData(data);
  res.json({ success: true });
});
app.post('/api/admin/experience', auth, (req, res) => {
  const data = readData();
  const newExp = { id: 'exp' + Date.now(), ...req.body };
  data.experience.unshift(newExp);
  writeData(data);
  res.json({ success: true, experience: data.experience });
});
app.put('/api/admin/experience/:id', auth, (req, res) => {
  const data = readData();
  const idx = data.experience.findIndex(e => e.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  data.experience[idx] = { ...data.experience[idx], ...req.body };
  writeData(data);
  res.json({ success: true });
});
app.delete('/api/admin/experience/:id', auth, (req, res) => {
  const data = readData();
  data.experience = data.experience.filter(e => e.id !== req.params.id);
  writeData(data);
  res.json({ success: true });
});

// ── PROJECTS ──
app.get('/api/admin/projects', auth, (req, res) => {
  res.json(readData().projects);
});
app.put('/api/admin/projects', auth, (req, res) => {
  const data = readData();
  data.projects = req.body;
  writeData(data);
  res.json({ success: true });
});
app.post('/api/admin/projects', auth, (req, res) => {
  const data = readData();
  const newProject = {
    id: 'p' + Date.now(),
    num: String(data.projects.length + 1).padStart(2, '0'),
    ...req.body
  };
  data.projects.push(newProject);
  writeData(data);
  res.json({ success: true, project: newProject });
});
app.put('/api/admin/projects/:id', auth, (req, res) => {
  const data = readData();
  const idx = data.projects.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  data.projects[idx] = { ...data.projects[idx], ...req.body };
  writeData(data);
  res.json({ success: true });
});
app.delete('/api/admin/projects/:id', auth, (req, res) => {
  const data = readData();
  data.projects = data.projects.filter(p => p.id !== req.params.id);
  // Re-number
  data.projects = data.projects.map((p, i) => ({ ...p, num: String(i + 1).padStart(2, '0') }));
  writeData(data);
  res.json({ success: true });
});

// ── CERTIFICATIONS ──
app.get('/api/admin/certifications', auth, (req, res) => {
  res.json(readData().certifications);
});
app.put('/api/admin/certifications', auth, (req, res) => {
  const data = readData();
  data.certifications = req.body;
  writeData(data);
  res.json({ success: true });
});
app.post('/api/admin/certifications', auth, (req, res) => {
  const data = readData();
  data.certifications.push(req.body);
  writeData(data);
  res.json({ success: true });
});
app.delete('/api/admin/certifications/:index', auth, (req, res) => {
  const data = readData();
  data.certifications.splice(parseInt(req.params.index), 1);
  writeData(data);
  res.json({ success: true });
});

// ── Change password ──
app.post('/api/admin/change-password', auth, (req, res) => {
  const { newPassword } = req.body;
  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }
  // Update .env file
  const envPath = path.join(__dirname, '.env');
  let env = fs.readFileSync(envPath, 'utf8');
  env = env.replace(/ADMIN_PASSWORD=.*/,  `ADMIN_PASSWORD=${newPassword}`);
  fs.writeFileSync(envPath, env);
  process.env.ADMIN_PASSWORD = newPassword;
  res.json({ success: true });
});

// ── Admin panel route ──
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'index.html'));
});

// ── Fallback ──
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n✅ Ali Shaheen Portfolio running on http://localhost:${PORT}`);
  console.log(`🔐 Admin panel: http://localhost:${PORT}/admin`);
  console.log(`📡 API: http://localhost:${PORT}/api/portfolio\n`);
});
