# Ali Shaheen Portfolio — Full Stack

## Project Structure
```
ali-portfolio/
├── server.js          ← Backend (Node.js + Express)
├── package.json       ← Dependencies
├── .env               ← Config (password, JWT secret)
├── data/
│   └── portfolio.json ← All your content (edit via admin panel)
├── public/
│   └── index.html     ← Your portfolio website
└── admin/
    └── index.html     ← Admin panel dashboard
```

## Run Locally
```bash
npm install
npm start
```
Then open:
- Website: http://localhost:3000
- Admin:   http://localhost:3000/admin  (password: admin123)

## Deploy to Railway (Free & Easy)

1. Go to https://railway.app and sign up
2. Click "New Project" → "Deploy from GitHub repo"
3. Upload your project or connect GitHub
4. Add environment variables:
   - PORT=3000
   - JWT_SECRET=your_secret_here
   - ADMIN_PASSWORD=your_password_here
5. Done! Railway gives you a free URL

## Deploy to Render (Also Free)

1. Go to https://render.com
2. New → Web Service
3. Connect your GitHub repo
4. Build Command: `npm install`
5. Start Command: `node server.js`
6. Add environment variables (same as above)
7. Done!

## API Endpoints
| Method | URL | Description |
|--------|-----|-------------|
| GET | /api/portfolio | Get all data |
| POST | /api/login | Login (returns JWT token) |
| PUT | /api/admin/profile | Update profile |
| PUT | /api/admin/skills | Update skills |
| POST | /api/admin/skills | Add skill |
| DELETE | /api/admin/skills/:index | Delete skill |
| POST | /api/admin/experience | Add experience |
| PUT | /api/admin/experience/:id | Update experience |
| DELETE | /api/admin/experience/:id | Delete experience |
| POST | /api/admin/projects | Add project |
| PUT | /api/admin/projects/:id | Update project |
| DELETE | /api/admin/projects/:id | Delete project |
| PUT | /api/admin/certifications | Update certifications |
| POST | /api/admin/change-password | Change admin password |

## Change Default Password
Edit `.env` file:
```
ADMIN_PASSWORD=your_new_password
```
Or change it from the Admin Panel → Settings tab.
