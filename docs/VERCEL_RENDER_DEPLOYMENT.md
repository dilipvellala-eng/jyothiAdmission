# Vercel + Render Deployment

This project is ready for a split deployment:

- Frontend: Vercel
- Backend API: Render
- Database: MongoDB Atlas

## 1. MongoDB Atlas

Create a MongoDB Atlas cluster and copy the connection string.

Use a database name in the URI:

```text
mongodb+srv://USERNAME:PASSWORD@CLUSTER_HOST/school_admissions
```

For Render access, add network access. During setup you can use:

```text
0.0.0.0/0
```

For production, restrict access where possible.

## 2. Deploy Backend to Render

Create a new Render Web Service from your GitHub repo.

Settings:

```text
Root Directory: server
Runtime: Node
Build Command: npm install
Start Command: npm start
Health Check Path: /api/health
```

Environment variables:

```env
NODE_ENV=production
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@CLUSTER_HOST/school_admissions
JWT_SECRET=use-a-long-random-secret
JWT_EXPIRES_IN=7d
CLIENT_URL=https://your-vercel-app.vercel.app
CLIENT_URLS=https://your-vercel-app.vercel.app,https://your-custom-domain.com
UPLOAD_DIR=uploads
MAX_FILE_SIZE_MB=5
```

After deployment, confirm:

```text
https://your-render-backend.onrender.com/api/health
```

## 3. Deploy Frontend to Vercel

Create a new Vercel project from the same GitHub repo.

Settings:

```text
Root Directory: client
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

Environment variable:

```env
VITE_API_URL=https://your-render-backend.onrender.com/api
```

The `client/vercel.json` file includes SPA rewrites so routes like `/login`, `/apply`, and `/admin/applications` work after refresh.

## 4. Update CORS

After Vercel gives you the final frontend URL, add it to Render:

```env
CLIENT_URL=https://your-vercel-app.vercel.app
CLIENT_URLS=https://your-vercel-app.vercel.app
```

If you add a custom domain, include both:

```env
CLIENT_URLS=https://your-vercel-app.vercel.app,https://admissions.yourschool.com
```

## 5. Seed Production Data

Render does not automatically run the seed script. To create default users/classes, run locally once against Atlas:

```powershell
cd server
Copy-Item .env.production.example .env
```

Set the Atlas `MONGO_URI`, then:

```powershell
npm.cmd run seed
```

Do this carefully because it writes to the production database.

## 6. Uploads Warning

The current app stores uploaded files in `server/uploads`. On Render this filesystem is not ideal for long-term document storage unless you configure persistent storage.

Recommended production options:

- Cloudinary
- AWS S3
- Azure Blob Storage
- Render persistent disk on a paid service

