# Backend Deployment Guide

This guide covers deploying your Face Recognition backend to production.

## Prerequisites

- Node.js 16+ installed
- MongoDB database (local or cloud)
- A hosting platform account (Render, Railway, Heroku, etc.)

## Environment Variables

Create a `.env` file with these variables:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_random_secret_key
```

**Important:** Generate a strong JWT_SECRET for production:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Deployment Options

### Option 1: Render (Recommended - Free Tier Available)

1. **Create a Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Create a New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `face-web-backend` folder

3. **Configure Service**
   - **Name:** face-auth-backend
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

4. **Add Environment Variables**
   - Go to "Environment" tab
   - Add:
     - `MONGODB_URI` - Your MongoDB connection string
     - `JWT_SECRET` - Your secure secret key
     - `PORT` - 5000 (optional, Render sets this automatically)

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Your backend URL: `https://your-service-name.onrender.com`

### Option 2: Railway

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Deploy from GitHub**
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Railway auto-detects Node.js

3. **Configure**
   - Add environment variables in Settings → Variables
   - Set root directory to `face-web-backend` if needed

4. **Get URL**
   - Railway provides a public URL automatically
   - Find it in Settings → Domains

### Option 3: Heroku

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Login and Create App**
   ```bash
   heroku login
   cd face-web-backend
   heroku create your-app-name
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set MONGODB_URI="your_mongodb_uri"
   heroku config:set JWT_SECRET="your_jwt_secret"
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

### Option 4: VPS (DigitalOcean, AWS, etc.)

1. **SSH into your server**
   ```bash
   ssh user@your-server-ip
   ```

2. **Install Node.js and MongoDB**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Clone and Setup**
   ```bash
   git clone your-repo-url
   cd face-web-backend
   npm install
   ```

4. **Create .env file**
   ```bash
   nano .env
   # Add your environment variables
   ```

5. **Use PM2 for Process Management**
   ```bash
   npm install -g pm2
   pm2 start server.js --name face-backend
   pm2 startup
   pm2 save
   ```

6. **Setup Nginx as Reverse Proxy**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## MongoDB Setup

### Option A: MongoDB Atlas (Cloud - Recommended)

1. **Create Account**
   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for free

2. **Create Cluster**
   - Choose Free Tier (M0)
   - Select region closest to your backend

3. **Setup Database Access**
   - Database Access → Add New User
   - Create username and password
   - Grant "Read and write to any database"

4. **Setup Network Access**
   - Network Access → Add IP Address
   - Add `0.0.0.0/0` (allow from anywhere) for development
   - For production, add your server's IP

5. **Get Connection String**
   - Clusters → Connect → Connect your application
   - Copy connection string
   - Replace `<password>` with your database password
   - Example: `mongodb+srv://user:password@cluster.mongodb.net/faceAuth`

### Option B: Local MongoDB

If running on VPS:
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

Connection string: `mongodb://localhost:27017/faceAuth`

## Post-Deployment

### 1. Test Your API

```bash
# Health check
curl https://your-backend-url.com/api/auth/test

# Register test
curl -X POST https://your-backend-url.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","faceDescriptor":[...]}'
```

### 2. Update Frontend

Update your frontend `api.js` with the production URL:

```javascript
const API_URL = 'https://your-backend-url.com/api';
```

### 3. Enable HTTPS

Most platforms (Render, Railway, Heroku) provide HTTPS automatically.

For VPS, use Let's Encrypt:
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Monitoring

### Check Logs

**Render/Railway:** View logs in dashboard

**Heroku:**
```bash
heroku logs --tail
```

**PM2:**
```bash
pm2 logs face-backend
pm2 monit
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Check MONGODB_URI is correct
   - Verify IP whitelist in MongoDB Atlas
   - Ensure database user has correct permissions

2. **CORS Errors**
   - Update CORS settings in `server.js` if needed:
   ```javascript
   app.use(cors({
     origin: 'https://your-frontend-url.com'
   }));
   ```

3. **Port Already in Use**
   - Ensure PORT environment variable is set correctly
   - Check if another process is using the port

4. **JWT Errors**
   - Verify JWT_SECRET is set in environment variables
   - Ensure it matches between deployments

## Security Checklist

- [ ] Strong JWT_SECRET generated
- [ ] MongoDB credentials secured
- [ ] CORS configured for specific origins
- [ ] HTTPS enabled
- [ ] Environment variables not committed to Git
- [ ] MongoDB IP whitelist configured
- [ ] Rate limiting implemented (optional)
- [ ] Input validation in place

## Scaling

For high traffic:
- Use MongoDB Atlas with larger cluster
- Enable database indexing on username field
- Add Redis for session management
- Use load balancer for multiple backend instances
- Implement caching strategies

## Backup

### MongoDB Backup

**Atlas:** Automatic backups included

**Self-hosted:**
```bash
mongodump --uri="mongodb://localhost:27017/faceAuth" --out=/backup/
```

## Support

For issues:
1. Check logs first
2. Verify environment variables
3. Test MongoDB connection separately
4. Review CORS settings

---

**Your backend is now live! 🚀**

Remember to update your frontend API URL to point to the production backend.
