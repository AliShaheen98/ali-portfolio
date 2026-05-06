require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'portfolio.json');
const JWT_SECRET = process.env.JWT_SECRET || 'ali_secret_2025';

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── Embedded fallback data (used when data/portfolio.json missing) ──
const FALLBACK_DATA = {"profile": {"name": "Ali Shaheen", "title": "Senior iOS & Flutter Developer", "subtitle": "Mobile Team Lead", "tagline": "Mobile Team Lead with 6+ years shipping production apps for 15+ international clients across Saudi Arabia, the Gulf, Egypt, the US, and Europe. Based in Gaza, Palestine.", "location": "Gaza, Palestine", "email": "ali.moshaheen@gmail.com", "phone": "+970 598 552 664", "linkedin": "https://linkedin.com/in/alishaheen98", "github": "https://github.com/AliShaheen98", "status": "Available Now", "available": true, "stats": [{"number": "6+", "label": "Years Experience"}, {"number": "20+", "label": "Apps Shipped"}, {"number": "15+", "label": "Int'l Clients"}, {"number": "5", "label": "Teams Led"}], "about": ["I'm a <strong>Senior Mobile Developer and Team Lead</strong> specializing in iOS (Swift, SwiftUI) and Flutter. I architect, build, and ship production apps for telecom, government, real estate, and services sectors.", "My career has taken me through <strong>Saudi Arabia's leading mobile studios</strong> — INOVAR and JIFF Technology — leading teams of 4–5 developers and delivering apps used by thousands.", "I care deeply about <strong>clean architecture, performance, and code quality</strong> — and I mentor teams to build the same way."], "tags": ["Swift", "SwiftUI", "Flutter", "Dart", "Objective-C", "Clean Architecture", "MVVM", "Bloc", "GetX", "Firebase", "CI/CD", "TDD"]}, "skills": [{"icon": "🍎", "name": "iOS Native", "items": "Swift · SwiftUI · UIKit\nObjective-C · Core Animation\nCore Location · ARKit · CoreML"}, {"icon": "💙", "name": "Flutter & Dart", "items": "Flutter 3 · Dart\nCross-platform iOS & Android\nBloc · Cubit · GetX · Riverpod"}, {"icon": "🏗️", "name": "Architecture", "items": "Clean Architecture · MVVM\nMVC · MVP · VIPER\nSOLID Principles"}, {"icon": "🔥", "name": "Backend & APIs", "items": "REST APIs · GraphQL\nFirebase (Firestore, FCM, Auth)\nGCP · AWS (EC2, S3)"}, {"icon": "⚙️", "name": "DevOps & CI/CD", "items": "Fastlane · Jenkins\nGitLab CI · Travis CI\nDocker · Azure DevOps"}, {"icon": "💳", "name": "Integrations", "items": "Stripe · Apple Pay · IAP\nGoogle Maps · Apple Maps\nOAuth · SSO · Push Notifications"}, {"icon": "🧪", "name": "Testing", "items": "Unit Testing\nWidget Testing\nIntegration Testing · TDD"}, {"icon": "📋", "name": "Leadership", "items": "Scrum · Kanban · Agile\nJira · Confluence\nSprint Planning · Reviews"}], "experience": [{"id": "exp1", "role": "Lead Mobile Developer", "badge": "iOS & Flutter", "company": "INOVAR", "location": "Riyadh, Saudi Arabia", "period": "Apr 2022 — Present", "current": true, "points": ["Led a team of 4–5 developers across sprint planning, code reviews, and delivery for 5+ production apps", "Architected scalable solutions using Clean Architecture, MVVM, Bloc, and GetX", "Built Balady 940 (MOMRA) — Government employee services app for Saudi Ministry of Municipality in Swift", "Built Lebara ONS — Telecom digital services platform for the Saudi market in Flutter", "Established CI/CD pipelines with Fastlane + Azure DevOps — shipped concept to production in under 2 months"], "chips": ["Balady 940", "Lebara ONS", "Jaree App"]}, {"id": "exp2", "role": "Mobile Team Lead", "badge": "iOS & Flutter", "company": "JIFF Technology", "location": "Riyadh, Saudi Arabia", "period": "Jun 2021 — Oct 2023", "current": false, "points": ["Promoted twice: Mid-Senior → Senior Developer → Mobile Team Lead", "Shipped 15+ production apps to App Store and Google Play as developer and team lead", "Developed Flutter cross-platform apps and native iOS apps with Swift, UIKit, and Core Animation", "Conducted technical interviews and mentored junior and senior developers"], "chips": ["Matn Talib Al-Ilm", "15+ apps shipped"]}, {"id": "exp3", "role": "iOS Developer", "badge": "", "company": "Future Vision Solutions", "location": "Riyadh, Saudi Arabia", "period": "Feb 2020 — Jan 2022", "current": false, "points": ["Started as paid trainee, rapidly progressed to full iOS Developer", "Built Mashi Delivery — On-demand delivery platform with real-time tracking in Swift", "Built Al-Sharif Real Estate — Property listings for residential and commercial sectors"], "chips": ["Mashi Delivery", "Al-Sharif Real Estate"]}, {"id": "exp4", "role": "Freelance iOS & Flutter Developer", "badge": "", "company": "Self-Employed", "location": "Remote — Upwork & Mostaql", "period": "Dec 2018 — Jan 2023", "current": false, "points": ["Delivered 10+ apps to App Store and Google Play for clients in Saudi Arabia, Egypt, US, and Gulf", "Managed the full app lifecycle independently: requirements, architecture, development, testing, deployment"], "chips": ["Exford Rent a Car", "WeeGoApp", "Drive Square", "Louz App", "Maghsool", "Adhmn"]}], "projects": [{"id": "p1", "num": "01", "icon": "🏛️", "category": "Government · iOS Native", "name": "Balady 940 (MOMRA)", "desc": "Employee services app for Saudi Ministry of Municipality. Handles sensitive data for thousands of staff.", "tags": ["Swift", "iOS", "Clean Arch"], "link": ""}, {"id": "p2", "num": "02", "icon": "📡", "category": "Telecom · Flutter", "name": "Lebara ONS", "desc": "Telecom digital services platform for Saudi market with complex carrier API integrations.", "tags": ["Flutter", "GetX", "Telecom APIs"], "link": ""}, {"id": "p3", "num": "03", "icon": "🚗", "category": "Car Rental · SwiftUI", "name": "Exford Rent a Car", "desc": "Full car rental booking platform built entirely with SwiftUI's declarative UI. Live on App Store.", "tags": ["SwiftUI", "iOS", "App Store"], "link": "https://apps.apple.com/app/id6479560795"}, {"id": "p4", "num": "04", "icon": "🛎️", "category": "On-demand · Flutter", "name": "WeeGoApp", "desc": "On-demand services with real-time tracking and Firebase backend. Cross-platform iOS & Android.", "tags": ["Flutter", "Firebase", "Real-time"], "link": "https://apps.apple.com/app/id6754606579"}, {"id": "p5", "num": "05", "icon": "🚙", "category": "Car Rental · Flutter", "name": "Drive Square", "desc": "Cross-platform car rental system with full booking flows and Google Maps integration.", "tags": ["Flutter", "Google Maps", "Booking"], "link": ""}, {"id": "p6", "num": "06", "icon": "🚿", "category": "Services · Swift → Flutter", "name": "Louz App", "desc": "Car wash booking with real-time tracking. Started as iOS Native Swift then migrated to Flutter.", "tags": ["Swift", "Flutter", "Migration"], "link": "https://apps.apple.com/app/id6451120012"}, {"id": "p7", "num": "07", "icon": "👕", "category": "Laundry · iOS + Android", "name": "Maghsool", "desc": "On-demand laundry services built with iOS Native Swift plus separate Google Play Android version.", "tags": ["Swift", "iOS", "Android"], "link": "https://apps.apple.com/app/id6670730000"}, {"id": "p8", "num": "08", "icon": "🏠", "category": "Home Services · Flutter", "name": "Adhmn", "desc": "Home maintenance platform with Firebase backend, technician dispatch, and service booking.", "tags": ["Flutter", "Firebase", "Dispatch"], "link": ""}, {"id": "p9", "num": "09", "icon": "🏡", "category": "Real Estate · Swift", "name": "Al-Sharif Real Estate", "desc": "Property listings covering residential, commercial, and industrial sectors with REST API.", "tags": ["Swift", "REST API", "Apple Maps"], "link": "https://apps.apple.com/app/id1609398407"}, {"id": "p10", "num": "10", "icon": "🛒", "category": "E-Commerce · Swift", "name": "Al Qannsa", "desc": "E-commerce for Middle East shopping with REST APIs and full payment integration.", "tags": ["Swift", "REST API", "Payments"], "link": "https://apps.apple.com/app/id1513695726"}, {"id": "p11", "num": "11", "icon": "🚚", "category": "Delivery · Flutter", "name": "Mashi Delivery", "desc": "On-demand delivery platform with real-time order tracking and full courier management.", "tags": ["Flutter", "Real-time", "Tracking"], "link": ""}, {"id": "p12", "num": "12", "icon": "📚", "category": "Education · iOS", "name": "Matn Talib Al-Ilm", "desc": "Educational iOS app with content delivery and user management. Available on App Store.", "tags": ["Swift", "iOS", "Content"], "link": "https://apps.apple.com/app/id1439459539"}], "certifications": [{"icon": "🍎", "title": "Complete iOS App Development Bootcamp — Swift & Objective-C"}, {"icon": "💙", "title": "The Complete Flutter & Dart Development Course"}, {"icon": "🏗️", "title": "Flutter Clean Architecture — Flutter 3"}, {"icon": "📋", "title": "Project Management Crash Course"}, {"icon": "⚙️", "title": "Nintex K2 Five for SharePoint Practitioner"}, {"icon": "🔌", "title": "Nintex Automation: Business Analyst & IT Developer"}]};

// ── Helpers ──
const readData = () => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    }
  } catch(e) {}
  return JSON.parse(JSON.stringify(FALLBACK_DATA));
};

const writeData = (data) => {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch(e) {
    console.error('Write error:', e.message);
  }
};

// Initialize data file if missing
if (!fs.existsSync(DATA_FILE)) {
  writeData(FALLBACK_DATA);
  console.log('Data file initialized from embedded data');
}

// ── Auth ──
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try { req.user = jwt.verify(token, JWT_SECRET); next(); }
  catch { res.status(401).json({ error: 'Invalid token' }); }
};

// ── PUBLIC API ──
app.get('/api/portfolio', (req, res) => res.json(readData()));
app.get('/api/portfolio/:section', (req, res) => {
  const data = readData();
  if (!data[req.params.section]) return res.status(404).json({ error: 'Not found' });
  res.json(data[req.params.section]);
});

// ── AUTH ──
app.post('/api/login', (req, res) => {
  const adminPass = process.env.ADMIN_PASSWORD || 'admin123';
  if (req.body.password !== adminPass) return res.status(401).json({ error: 'Wrong password' });
  const token = jwt.sign({ admin: true }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token });
});

// ── ADMIN API ──
app.put('/api/admin/profile', auth, (req, res) => {
  const data = readData(); data.profile = { ...data.profile, ...req.body };
  writeData(data); res.json({ success: true });
});
app.put('/api/admin/skills', auth, (req, res) => {
  const data = readData(); data.skills = req.body;
  writeData(data); res.json({ success: true });
});
app.post('/api/admin/skills', auth, (req, res) => {
  const data = readData(); data.skills.push(req.body);
  writeData(data); res.json({ success: true });
});
app.delete('/api/admin/skills/:index', auth, (req, res) => {
  const data = readData(); data.skills.splice(parseInt(req.params.index), 1);
  writeData(data); res.json({ success: true });
});
app.post('/api/admin/experience', auth, (req, res) => {
  const data = readData();
  data.experience.unshift({ id: 'exp' + Date.now(), ...req.body });
  writeData(data); res.json({ success: true });
});
app.put('/api/admin/experience/:id', auth, (req, res) => {
  const data = readData();
  const idx = data.experience.findIndex(e => e.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  data.experience[idx] = { ...data.experience[idx], ...req.body };
  writeData(data); res.json({ success: true });
});
app.delete('/api/admin/experience/:id', auth, (req, res) => {
  const data = readData();
  data.experience = data.experience.filter(e => e.id !== req.params.id);
  writeData(data); res.json({ success: true });
});
app.post('/api/admin/projects', auth, (req, res) => {
  const data = readData();
  data.projects.push({ id: 'p' + Date.now(), num: String(data.projects.length + 1).padStart(2,'0'), ...req.body });
  writeData(data); res.json({ success: true });
});
app.put('/api/admin/projects/:id', auth, (req, res) => {
  const data = readData();
  const idx = data.projects.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  data.projects[idx] = { ...data.projects[idx], ...req.body };
  writeData(data); res.json({ success: true });
});
app.delete('/api/admin/projects/:id', auth, (req, res) => {
  const data = readData();
  data.projects = data.projects.filter(p => p.id !== req.params.id);
  data.projects = data.projects.map((p, i) => ({ ...p, num: String(i + 1).padStart(2, '0') }));
  writeData(data); res.json({ success: true });
});
app.put('/api/admin/certifications', auth, (req, res) => {
  const data = readData(); data.certifications = req.body;
  writeData(data); res.json({ success: true });
});
app.post('/api/admin/certifications', auth, (req, res) => {
  const data = readData(); data.certifications.push(req.body);
  writeData(data); res.json({ success: true });
});
app.delete('/api/admin/certifications/:index', auth, (req, res) => {
  const data = readData(); data.certifications.splice(parseInt(req.params.index), 1);
  writeData(data); res.json({ success: true });
});
app.post('/api/admin/change-password', auth, (req, res) => {
  const { newPassword } = req.body;
  if (!newPassword || newPassword.length < 6) return res.status(400).json({ error: 'Too short' });
  process.env.ADMIN_PASSWORD = newPassword;
  res.json({ success: true });
});

app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'admin', 'index.html')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.listen(PORT, () => {
  console.log('✅ Running on port', PORT);
  console.log('🔐 Admin: /admin');
});
