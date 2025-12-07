# LPRES Admin Backend

Professional REST API built with TypeScript, Express, and Supabase for the LPRES Admin Dashboard.

## 🚀 Features

- **TypeScript**: Full type safety and IntelliSense support
- **Express.js**: Fast, minimalist web framework
- **Supabase**: PostgreSQL database with built-in authentication
- **Swagger/OpenAPI**: Interactive API documentation
- **Validation**: Request validation using Zod schemas
- **Security**: Helmet, CORS, Rate Limiting
- **Authentication**: API key-based authentication (Public & Admin)
- **File Upload**: Image upload to Supabase Storage
- **Error Handling**: Centralized error handling
- **Logging**: Morgan for HTTP request logging

## 📋 Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Supabase account and project

## 🛠️ Installation

1. **Navigate to the backend folder:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```

4. **Configure your `.env` file:**
   ```env
   NODE_ENV=development
   PORT=5000
   API_VERSION=v1

   SUPABASE_URL=https://your-project-ref.supabase.co
   SUPABASE_ANON_KEY=your-anon-key-here
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

   CORS_ORIGIN=http://localhost:5173,http://localhost:3000
   ```

5. **Set up Supabase database:**
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Run the schema from `../supabase-schema.sql`
   - Create a storage bucket named `images` (public access)

## 🏃 Running the Server

### Development Mode
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

## 📚 API Documentation

Once the server is running, visit:

**Swagger UI:** http://localhost:5000/api/docs

The interactive documentation includes:
- All available endpoints
- Request/response schemas
- Authentication requirements
- Try-it-out functionality

## 🔑 Authentication

### Public Access (Anonymous Key)
Use the Supabase anonymous key for public operations:

**Headers:**
```
Authorization: Bearer YOUR_ANON_KEY
```
or
```
x-api-key: YOUR_ANON_KEY
```

**Allowed Operations:**
- ✅ Read all projects and news
- ✅ Submit complaints
- ✅ Subscribe/unsubscribe from newsletter

### Admin Access (Service Role Key)
Use the Supabase service role key for admin operations:

**Headers:**
```
Authorization: Bearer YOUR_SERVICE_ROLE_KEY
```
or
```
x-api-key: YOUR_SERVICE_ROLE_KEY
```

**Allowed Operations:**
- ✅ All CRUD operations on projects
- ✅ All CRUD operations on news
- ✅ View and manage all complaints
- ✅ View and manage subscribers

⚠️ **Security Warning:** Never expose the Service Role Key in client-side code!

## 🛣️ API Endpoints

### Base URL
```
http://localhost:5000/api/v1
```

### Projects
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/projects` | Public | Get all projects |
| GET | `/projects/:id` | Public | Get project by ID |
| POST | `/projects` | Admin | Create new project |
| PUT | `/projects/:id` | Admin | Update project |
| DELETE | `/projects/:id` | Admin | Delete project |
| POST | `/projects/upload` | Admin | Upload project images |

### News
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/news` | Public | Get all news |
| GET | `/news/:id` | Public | Get news by ID |
| POST | `/news` | Admin | Create news article |
| PUT | `/news/:id` | Admin | Update news article |
| DELETE | `/news/:id` | Admin | Delete news article |
| POST | `/news/upload` | Admin | Upload news images |

### Complaints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/complaints` | Admin | Get all complaints |
| GET | `/complaints/:id` | Admin | Get complaint by ID |
| POST | `/complaints` | Public | Submit complaint |
| DELETE | `/complaints/:id` | Admin | Delete complaint |

### Newsletter Subscribers
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/subscribers` | Admin | Get all subscribers |
| GET | `/subscribers/count` | Public | Get subscriber count |
| POST | `/subscribers/subscribe` | Public | Subscribe to newsletter |
| POST | `/subscribers/unsubscribe` | Public | Unsubscribe |

## 📝 Request Examples

### Get All Projects
```bash
curl -X GET http://localhost:5000/api/v1/projects \
  -H "x-api-key: YOUR_ANON_KEY"
```

### Create a Project (Admin)
```bash
curl -X POST http://localhost:5000/api/v1/projects \
  -H "x-api-key: YOUR_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Infrastructure Project",
    "description": "Detailed description...",
    "location": "Minna, Niger State",
    "status": "in progress",
    "images": []
  }'
```

### Submit a Complaint
```bash
curl -X POST http://localhost:5000/api/v1/complaints \
  -H "x-api-key: YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Website Issue",
    "description": "Detailed complaint..."
  }'
```

### Subscribe to Newsletter
```bash
curl -X POST http://localhost:5000/api/v1/subscribers/subscribe \
  -H "x-api-key: YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "subscriber@example.com"
  }'
```

## 🗂️ Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── index.ts           # Configuration settings
│   │   ├── supabase.ts        # Supabase client
│   │   └── swagger.ts         # Swagger/OpenAPI config
│   ├── controllers/
│   │   ├── projectController.ts
│   │   ├── newsController.ts
│   │   ├── complaintController.ts
│   │   └── subscriberController.ts
│   ├── middleware/
│   │   ├── auth.ts            # Authentication middleware
│   │   ├── validate.ts        # Validation middleware
│   │   ├── errorHandler.ts    # Error handling
│   │   └── upload.ts          # File upload middleware
│   ├── routes/
│   │   ├── index.ts           # Route aggregator
│   │   ├── projectRoutes.ts
│   │   ├── newsRoutes.ts
│   │   ├── complaintRoutes.ts
│   │   └── subscriberRoutes.ts
│   ├── types/
│   │   └── database.ts        # TypeScript types
│   ├── validators/
│   │   └── schemas.ts         # Zod validation schemas
│   ├── app.ts                 # Express app setup
│   └── server.ts              # Server entry point
├── .env.example               # Environment variables template
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## 🔒 Security Features

- **Helmet**: Sets various HTTP headers for security
- **CORS**: Configurable Cross-Origin Resource Sharing
- **Rate Limiting**: 100 requests per 15 minutes (configurable)
- **Input Validation**: Zod schemas for all inputs
- **Authentication**: API key verification
- **File Upload Limits**: 5MB max file size
- **SQL Injection Protection**: Supabase parameterized queries

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "count": 10
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

## 🚢 Deployment

### Option 1: Traditional Server (VPS, EC2, etc.)

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Set environment variables on the server**

3. **Start with PM2:**
   ```bash
   npm install -g pm2
   pm2 start dist/server.js --name lpres-backend
   pm2 save
   pm2 startup
   ```

### Option 2: Docker

1. **Create `Dockerfile`:**
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY dist ./dist
   EXPOSE 5000
   CMD ["node", "dist/server.js"]
   ```

2. **Build and run:**
   ```bash
   docker build -t lpres-backend .
   docker run -p 5000:5000 --env-file .env lpres-backend
   ```

### Option 3: Cloud Platforms

- **Heroku**: Push to Heroku with Procfile
- **Railway**: Connect GitHub repo and deploy
- **Render**: Auto-deploy from GitHub
- **DigitalOcean App Platform**: One-click deploy

### Environment Variables for Production

```env
NODE_ENV=production
PORT=5000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-production-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-production-service-key
CORS_ORIGIN=https://yourdomain.com,https://admin.yourdomain.com
```

## 🔧 Development

### Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### Adding New Endpoints

1. **Create controller** in `src/controllers/`
2. **Add validation schema** in `src/validators/schemas.ts`
3. **Create route** in `src/routes/`
4. **Register route** in `src/routes/index.ts`
5. **Add Swagger docs** in controller file

## 📦 Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Validation**: Zod
- **Documentation**: Swagger/OpenAPI
- **Security**: Helmet, CORS
- **Rate Limiting**: express-rate-limit
- **File Upload**: Multer
- **Logging**: Morgan

## 🐛 Troubleshooting

### Server won't start
- Check if `.env` file exists and has correct values
- Verify Supabase URL and keys are correct
- Ensure port 5000 is not in use

### Authentication errors
- Verify API keys in headers
- Check Supabase dashboard for key regeneration
- Ensure RLS policies are set up correctly

### Database errors
- Run `supabase-schema.sql` in Supabase SQL Editor
- Check if tables exist in Supabase dashboard
- Verify service role key has admin access

### CORS errors
- Add your frontend URL to `CORS_ORIGIN` in `.env`
- Multiple origins: `http://localhost:5173,https://yourdomain.com`

## 📄 License

MIT

## 👥 Support

For issues and questions:
- Check the [API Documentation](http://localhost:5000/api/docs)
- Review Supabase setup in `../supabase-schema.sql`
- Verify environment variables in `.env`

---

**Built with ❤️ for LPRES Admin Dashboard**
