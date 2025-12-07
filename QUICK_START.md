# LPRES Admin Backend - Quick Start Guide

## ⚡ 5-Minute Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials:
```env
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Setup Database
- Go to Supabase SQL Editor
- Run the schema from `../supabase-schema.sql`
- Create storage bucket: `images` (public)

### 4. Start Server
```bash
npm run dev
```

### 5. Test API
Visit: http://localhost:5000/api/docs

## 🎯 Quick Test

Test the health endpoint:
```bash
curl http://localhost:5000/health
```

Get projects (replace with your anon key):
```bash
curl -X GET http://localhost:5000/api/v1/projects \
  -H "x-api-key: YOUR_ANON_KEY"
```

## 📚 Next Steps

- Read full documentation: [README.md](./README.md)
- Explore Swagger UI: http://localhost:5000/api/docs
- Connect your frontend to the API

## 🚀 Deploy to Production

### Heroku
```bash
heroku create lpres-backend
heroku config:set NODE_ENV=production
heroku config:set SUPABASE_URL=your-url
heroku config:set SUPABASE_ANON_KEY=your-key
heroku config:set SUPABASE_SERVICE_ROLE_KEY=your-key
git push heroku main
```

### Railway
1. Connect GitHub repository
2. Add environment variables
3. Deploy automatically

### DigitalOcean App Platform
1. Connect repository
2. Set environment variables
3. Click "Deploy"

---

**That's it! Your API is ready to use! 🎉**
