# 🚀 Z&J's Vestiaro Backend - Deployment Guide

Complete guide to deploy your backend to production.

## Pre-Deployment Checklist

- [ ] All tests passing locally
- [ ] Database schema created in Supabase
- [ ] Environment variables configured
- [ ] Stripe account setup (production keys ready)
- [ ] Domain/URL decided
- [ ] SSL certificate obtained (if not using platform)
- [ ] Error tracking service ready (optional: Sentry)

## 🌍 Deployment Options

### Option 1: Railway (⭐ Recommended - Easiest)

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub"
   - Connect your repository

3. **Configure Environment**
   - Add environment variables in Railway dashboard
   - Copy from your `.env` file

4. **Deploy**
   - Railway auto-deploys on git push
   - Check deployment status
   - Copy generated URL

**Cost:** Free tier available, paid plans start at $5/month

### Option 2: Heroku

1. **Create Heroku Account**
   ```bash
   brew install heroku/brew/heroku  # macOS
   # or download from heroku.com
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create App**
   ```bash
   heroku create your-app-name
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set SUPABASE_URL=your-url
   heroku config:set SUPABASE_ANON_KEY=your-key
   # ... set all other variables
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

6. **View Logs**
   ```bash
   heroku logs --tail
   ```

**Cost:** Free tier ended (paid plans start at $7/month)

### Option 3: Docker + AWS (Advanced)

1. **Build Docker Image**
   ```bash
   docker build -t zj-vestiaro-backend:latest .
   ```

2. **Tag for ECR**
   ```bash
   docker tag zj-vestiaro-backend:latest your-account.dkr.ecr.us-east-1.amazonaws.com/zj-backend:latest
   ```

3. **Push to ECR**
   ```bash
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin your-account.dkr.ecr.us-east-1.amazonaws.com
   docker push your-account.dkr.ecr.us-east-1.amazonaws.com/zj-backend:latest
   ```

4. **Deploy to ECS/App Runner**
   - Follow AWS console instructions
   - Configure security groups
   - Set environment variables
   - Deploy

**Cost:** Variable, starts at ~$0.50/month

### Option 4: Render (Easy)

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Create New Web Service**
   - Select "Web Service"
   - Connect GitHub repo
   - Choose runtime: Node

3. **Configure Service**
   - Set build command: `npm install`
   - Set start command: `npm start`
   - Add environment variables

4. **Deploy**
   - Click "Deploy"
   - Monitor build logs
   - Get public URL

**Cost:** Free tier available, paid plans start at $7/month

### Option 5: Vercel (Functions)

1. **Create Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub

2. **Create Project**
   - Import Git repository
   - Select Node.js

3. **Configure Environment**
   - Add environment variables
   - Configure serverless functions

4. **Deploy**
   - Auto-deploys on push
   - Get public URL

**Cost:** Free tier available

## Environment Variables for Production

```env
NODE_ENV=production
PORT=5000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET=your-super-secret-production-key-min-32-chars
REFRESH_TOKEN_SECRET=your-refresh-secret-production-key
STRIPE_SECRET_KEY=sk_live_your_production_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_production_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
CORS_ORIGIN=https://yourdomain.com
```

⚠️ **Security Tips:**
- Use strong random secrets (min 32 characters)
- Never commit `.env` to git
- Rotate secrets periodically
- Use different secrets for dev/prod
- Store secrets in platform's secret manager

## Post-Deployment

### 1. Verify Server
```bash
curl https://your-deployed-url.com/health
```

Should return:
```json
{"success":true,"message":"Server is running"}
```

### 2. Test Endpoints
```bash
# Get products
curl https://your-deployed-url.com/api/products/categories

# Register user
curl -X POST https://your-deployed-url.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{...}'
```

### 3. Configure Stripe Webhooks
1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://your-url/api/payments/webhook/stripe`
3. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
4. Copy webhook secret
5. Update `STRIPE_WEBHOOK_SECRET` in production

### 4. Configure CORS
Update `CORS_ORIGIN` to match your frontend domain:
```env
CORS_ORIGIN=https://your-frontend-domain.com
```

### 5. Set Up Monitoring

#### Option A: Sentry (Error Tracking)
```bash
npm install @sentry/node
```

Add to `server.js`:
```javascript
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
});
```

#### Option B: LogRocket
```bash
npm install logrocket
```

#### Option C: New Relic
```bash
npm install newrelic
```

### 6. Enable Database Backups
- Supabase: Automatic daily backups included
- Set backup retention policy
- Test restore procedure

### 7. Configure CDN (Optional)
- Cloudflare: Add CNAME record
- AWS CloudFront: Create distribution
- Bunny CDN: Easy setup

## Monitoring in Production

### Key Metrics
- Server uptime
- Response times
- Error rates
- API latency
- Database performance
- Stripe failures

### Logs to Monitor
```bash
# Check server logs
# Via platform dashboard or:
curl https://your-url/logs  # if logging endpoint available
```

### Alerts to Set
- [ ] Server down (>5 min)
- [ ] High error rate (>5%)
- [ ] Database connection errors
- [ ] Stripe failures
- [ ] Payment failures
- [ ] High latency (>1s)

## Troubleshooting

### Server Won't Start
- Check Node version matches requirements
- Verify all environment variables set
- Check database connection
- Review deployment logs

### Database Connection Errors
- Verify Supabase credentials
- Check IP allowlist in Supabase
- Ensure database tables exist
- Check network connectivity

### Stripe Errors
- Verify live keys (not test keys)
- Check webhook secret
- Ensure webhook endpoint is public
- Review Stripe webhook logs

### CORS Errors
- Verify `CORS_ORIGIN` matches frontend
- Check frontend is using correct API URL
- Enable credentials in frontend requests

### High Latency
- Check database query performance
- Verify server resources sufficient
- Use CDN for static files
- Implement caching

## Scaling (As You Grow)

### Phase 1: Startup (Current)
- Single server on free tier
- Database on shared instance
- Basic monitoring

### Phase 2: Growth
- Upgrade database to dedicated
- Add Redis for caching
- Enable rate limiting
- Add error tracking

### Phase 3: Scale
- Horizontal scaling (multiple servers)
- Load balancer
- Database replication
- Advanced caching
- Message queues
- Microservices

## Cost Optimization

### Supabase
- Free tier: 1 GB storage, 2 GB bandwidth
- Pro: $25/month
- Monitor usage to stay under limits

### Stripe
- No setup fees
- 2.9% + $0.30 per transaction
- No monthly fees

### Hosting
- Railway/Render: $5-10/month
- AWS/GCP: Scale as needed
- Vercel: Free for serverless

## Backup & Recovery

### Database Backups
- Supabase: Automatic daily
- Manual backup: [Supabase docs](https://supabase.com/docs/guides/database/backups)
- Test recovery regularly

### Application Backups
- Version control (git)
- Deployment history on platform
- Keep Docker image archived

## Security Checklist

- [ ] HTTPS enabled
- [ ] Secrets not in code
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] Helmet security headers
- [ ] Input validation active
- [ ] Database backups enabled
- [ ] Monitoring configured
- [ ] Error logging enabled
- [ ] Access logs enabled

## Performance Optimization

1. **Database**
   - Ensure indexes created
   - Monitor slow queries
   - Use pagination

2. **API**
   - Implement caching
   - Compress responses
   - Optimize payloads

3. **Server**
   - Use Node clustering
   - Monitor memory usage
   - Set resource limits

## Support

**Deployment Issues:**
- Check platform documentation
- Review deployment logs
- Verify environment variables
- Test locally first

**Technical Support:**
- Railway: [support.railway.app](https://support.railway.app)
- Heroku: [help.heroku.com](https://help.heroku.com)
- Render: [render.com/docs](https://render.com/docs)
- AWS: [aws.amazon.com/support](https://aws.amazon.com/support)

---

**Recommended:** Start with Railway or Render (easiest), upgrade to AWS/GCP later if needed.

**Support:** Check platform documentation or this guide's troubleshooting section.

**Good luck! 🚀**
