# 🚀 SoulCodes Deployment Guide

This comprehensive guide covers deploying the SoulCodes unified ecosystem across multiple platforms and environments.

## 📋 Pre-Deployment Checklist

### Environment Setup
- [ ] All API keys and tokens configured
- [ ] Database connections tested
- [ ] Service account files in place
- [ ] CORS origins properly configured
- [ ] SSL certificates ready for production

### Code Preparation
- [ ] All tests passing
- [ ] Code reviewed and approved
- [ ] Documentation updated
- [ ] Version tagged in Git
- [ ] Build artifacts generated

### Integration Testing
- [ ] Agent TARS automation tested
- [ ] Notion integration verified
- [ ] Brevo email sequences working
- [ ] Facebook posting functional
- [ ] Widget interactions tested

## 🌐 Frontend Deployment

### Option 1: GitHub Pages (Recommended for Static)

1. **Repository Setup**
```bash
# Ensure your repository is public or has GitHub Pages enabled
git checkout main
git push origin main
```

2. **Configure GitHub Pages**
- Go to repository Settings > Pages
- Select source: Deploy from a branch
- Choose branch: main
- Select folder: / (root) or /docs
- Save configuration

3. **Custom Domain Setup**
```bash
# Add CNAME file to repository root
echo "soulcodes.site" > CNAME
git add CNAME
git commit -m "Add custom domain"
git push origin main
```

4. **DNS Configuration**
```
# Add these DNS records to your domain provider:
Type: CNAME
Name: www
Value: frankielee1971.github.io

Type: A
Name: @
Value: 185.199.108.153
Value: 185.199.109.153
Value: 185.199.110.153
Value: 185.199.111.153
```

### Option 2: Netlify (Recommended for Dynamic)

1. **Connect Repository**
- Log into Netlify
- Click "New site from Git"
- Connect to GitHub repository
- Select soulcodes-unified repository

2. **Build Configuration**
```yaml
# netlify.toml
[build]
  publish = "frontend"
  command = "echo 'No build needed for static site'"

[build.environment]
  NODE_VERSION = "20"

[[redirects]]
  from = "/api/*"
  to = "https://your-backend-url.herokuapp.com/api/:splat"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
```

3. **Environment Variables**
```bash
# Set in Netlify dashboard under Site settings > Environment variables
REACT_APP_API_URL=https://your-backend-url.herokuapp.com
REACT_APP_ENVIRONMENT=production
```

### Option 3: Vercel

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Deploy**
```bash
cd frontend
vercel --prod
```

3. **Configuration**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "*.html",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "https://your-backend-url.herokuapp.com/api/$1"
    }
  ]
}
```

## 🔧 Backend Deployment

### Option 1: Heroku (Recommended)

1. **Install Heroku CLI**
```bash
# macOS
brew tap heroku/brew && brew install heroku

# Ubuntu
curl https://cli-assets.heroku.com/install.sh | sh
```

2. **Create Heroku App**
```bash
cd backend
heroku create soulcodes-backend
heroku addons:create heroku-postgresql:hobby-dev
```

3. **Configure Environment Variables**
```bash
heroku config:set NOTION_TOKEN=your_notion_token
heroku config:set BREVO_API_KEY=your_brevo_key
heroku config:set FACEBOOK_ACCESS_TOKEN=your_fb_token
heroku config:set FACEBOOK_GROUP_ID=your_group_id
heroku config:set GOOGLE_DRIVE_FOLDER_ID=your_folder_id
heroku config:set CORS_ORIGINS='["https://soulcodes.site","https://digitallydefined.site"]'
```

4. **Deploy**
```bash
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

5. **Verify Deployment**
```bash
heroku logs --tail
heroku open
```

### Option 2: Railway

1. **Install Railway CLI**
```bash
npm install -g @railway/cli
```

2. **Deploy**
```bash
cd backend
railway login
railway init
railway up
```

3. **Configure Environment**
```bash
railway variables:set NOTION_TOKEN=your_notion_token
railway variables:set BREVO_API_KEY=your_brevo_key
# ... add all other environment variables
```

### Option 3: DigitalOcean App Platform

1. **Create App Spec**
```yaml
# app.yaml
name: soulcodes-backend
services:
- name: api
  source_dir: /backend
  github:
    repo: frankielee1971/soulcodes-unified
    branch: main
  run_command: python main.py
  environment_slug: python
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: PORT
    value: "8000"
  - key: NOTION_TOKEN
    value: your_notion_token
    type: SECRET
  # ... add all environment variables
```

2. **Deploy**
```bash
doctl apps create --spec app.yaml
```

## 🤖 Agent TARS Deployment

### Option 1: Heroku Scheduler

1. **Add Scheduler Add-on**
```bash
heroku addons:create scheduler:standard
```

2. **Configure Scheduled Jobs**
```bash
heroku addons:open scheduler
```

3. **Add Jobs in Dashboard**
```bash
# Daily automation at 9 AM UTC
python agent/agent_tars_enhanced.py

# Morning affirmations at 8 AM UTC  
python -c "from agent.agent_tars_enhanced import AgentTARS; AgentTARS().send_scheduled_emails()"

# Evening posts at 6 PM UTC
python -c "from agent.agent_tars_enhanced import AgentTARS; AgentTARS().post_to_facebook()"
```

### Option 2: GitHub Actions

1. **Create Workflow File**
```yaml
# .github/workflows/agent-tars.yml
name: Agent TARS Automation

on:
  schedule:
    - cron: '0 9 * * *'  # Daily at 9 AM UTC
    - cron: '0 8 * * *'  # Daily at 8 AM UTC for emails
    - cron: '0 18 * * *' # Daily at 6 PM UTC for posts

jobs:
  run-automation:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Set up Python
      uses: actions/setup-python@v2
      with:
        python-version: 3.11
    - name: Install dependencies
      run: |
        cd backend
        pip install -r requirements.txt
    - name: Run Agent TARS
      env:
        NOTION_TOKEN: ${{ secrets.NOTION_TOKEN }}
        BREVO_API_KEY: ${{ secrets.BREVO_API_KEY }}
        FACEBOOK_ACCESS_TOKEN: ${{ secrets.FACEBOOK_ACCESS_TOKEN }}
        FACEBOOK_GROUP_ID: ${{ secrets.FACEBOOK_GROUP_ID }}
        GOOGLE_SERVICE_ACCOUNT_FILE: ${{ secrets.GOOGLE_SERVICE_ACCOUNT_FILE }}
        GOOGLE_DRIVE_FOLDER_ID: ${{ secrets.GOOGLE_DRIVE_FOLDER_ID }}
      run: |
        cd agent
        python agent_tars_enhanced.py
```

2. **Configure Secrets**
- Go to repository Settings > Secrets and variables > Actions
- Add all required environment variables as secrets

### Option 3: Cron Job on VPS

1. **Set up Cron Jobs**
```bash
# Edit crontab
crontab -e

# Add these lines:
0 9 * * * cd /path/to/soulcodes-unified/agent && python agent_tars_enhanced.py
0 8 * * * cd /path/to/soulcodes-unified/agent && python -c "from agent_tars_enhanced import AgentTARS; AgentTARS().send_scheduled_emails()"
0 18 * * * cd /path/to/soulcodes-unified/agent && python -c "from agent_tars_enhanced import AgentTARS; AgentTARS().post_to_facebook()"
```

## 🔐 Security Configuration

### SSL/TLS Setup

1. **Let's Encrypt (Free)**
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Generate certificate
sudo certbot --nginx -d soulcodes.site -d www.soulcodes.site

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

2. **Cloudflare (Recommended)**
- Add domain to Cloudflare
- Enable SSL/TLS encryption
- Set SSL/TLS encryption mode to "Full (strict)"
- Enable "Always Use HTTPS"

### Environment Security

1. **Secure Environment Variables**
```bash
# Never commit .env files
echo ".env" >> .gitignore
echo "*.key" >> .gitignore
echo "service-account-*.json" >> .gitignore
```

2. **API Key Rotation**
```bash
# Set up regular rotation schedule
# Document key rotation procedures
# Use key management services when possible
```

### CORS Configuration

```python
# backend/main.py
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://soulcodes.site",
        "https://www.soulcodes.site",
        "https://digitallydefined.site",
        "https://www.digitallydefined.site"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)
```

## 📊 Monitoring & Analytics

### Application Monitoring

1. **Heroku Metrics**
```bash
# Enable metrics
heroku labs:enable "runtime-heroku-metrics"

# View metrics
heroku logs --tail
heroku ps:scale web=1
```

2. **Uptime Monitoring**
```bash
# Use services like:
# - UptimeRobot (free)
# - Pingdom
# - StatusCake
```

### Error Tracking

1. **Sentry Integration**
```python
# backend/main.py
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration

sentry_sdk.init(
    dsn="your-sentry-dsn",
    integrations=[FastApiIntegration()],
    traces_sample_rate=1.0,
)
```

2. **Log Aggregation**
```python
# Use structured logging
import logging
import json

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s %(levelname)s %(message)s'
)

logger = logging.getLogger(__name__)
```

### Analytics Setup

1. **Google Analytics 4**
```html
<!-- Add to frontend/enhanced_index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

2. **Custom Event Tracking**
```javascript
// Track widget usage
function trackWidgetUsage(widgetType) {
    gtag('event', 'widget_opened', {
        'widget_type': widgetType,
        'archetype': getUserArchetype()
    });
}

// Track archetype discovery
function trackArchetypeDiscovery(archetype) {
    gtag('event', 'archetype_discovered', {
        'archetype': archetype,
        'quiz_completion': true
    });
}
```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy SoulCodes

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Set up Python
      uses: actions/setup-python@v2
      with:
        python-version: 3.11
    - name: Install dependencies
      run: |
        cd backend
        pip install -r requirements.txt
    - name: Run tests
      run: |
        cd backend
        python -m pytest tests/

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
    - uses: actions/checkout@v2
    - name: Deploy to Netlify
      uses: nwtgck/actions-netlify@v1.2
      with:
        publish-dir: './frontend'
        production-branch: main
        github-token: ${{ secrets.GITHUB_TOKEN }}
        deploy-message: "Deploy from GitHub Actions"
      env:
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
    - uses: actions/checkout@v2
    - uses: akhileshns/heroku-deploy@v3.12.12
      with:
        heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
        heroku_app_name: "soulcodes-backend"
        heroku_email: "your-email@example.com"
        appdir: "backend"
```

## 🧪 Testing in Production

### Health Checks

1. **Backend Health Endpoint**
```python
# backend/main.py
@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0"
    }
```

2. **Frontend Health Check**
```javascript
// Test all widgets load correctly
async function healthCheck() {
    const widgets = [
        'archetype-calculator',
        'manifestation-tracker', 
        'affiliate-calculator'
    ];
    
    for (const widget of widgets) {
        try {
            await loadWidget(widget);
            console.log(`✅ ${widget} loaded successfully`);
        } catch (error) {
            console.error(`❌ ${widget} failed to load:`, error);
        }
    }
}
```

### Integration Testing

1. **Agent TARS Integration**
```bash
# Test all integrations
python -c "
from agent.notion_integration import NotionIntegrator
from agent.brevo_integration import BrevoIntegrator
from agent.facebook_integration import FacebookGroupIntegrator

# Test each integration
notion = NotionIntegrator()
brevo = BrevoIntegrator()
facebook = FacebookGroupIntegrator()

print('Testing integrations...')
# Add specific test calls here
"
```

2. **API Endpoint Testing**
```bash
# Test backend endpoints
curl -X GET https://your-backend-url.herokuapp.com/health
curl -X POST https://your-backend-url.herokuapp.com/webhook \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**
```python
# Ensure CORS is properly configured
# Check that frontend domain is in allowed origins
# Verify preflight requests are handled
```

2. **Environment Variable Issues**
```bash
# Check all required variables are set
heroku config
# Verify variable names match exactly
# Ensure no trailing spaces or quotes
```

3. **Agent TARS Not Running**
```bash
# Check logs for errors
heroku logs --tail --app soulcodes-backend
# Verify all API keys are valid
# Test individual integrations
```

4. **Widget Loading Issues**
```javascript
// Check browser console for errors
// Verify all script dependencies load
// Test iframe src paths are correct
```

### Performance Optimization

1. **Frontend Optimization**
```html
<!-- Optimize images -->
<img src="image.webp" alt="Description" loading="lazy">

<!-- Minify CSS and JS -->
<!-- Use CDN for external libraries -->
<!-- Enable gzip compression -->
```

2. **Backend Optimization**
```python
# Use async/await for I/O operations
# Implement caching where appropriate
# Optimize database queries
# Use connection pooling
```

## 📈 Scaling Considerations

### Horizontal Scaling

1. **Load Balancing**
```yaml
# Use multiple backend instances
# Implement session affinity if needed
# Consider database connection limits
```

2. **Database Scaling**
```sql
-- Use read replicas for read-heavy operations
-- Implement connection pooling
-- Consider database sharding for large datasets
```

### Monitoring at Scale

1. **Metrics Collection**
```python
# Implement custom metrics
# Monitor response times
# Track error rates
# Monitor resource usage
```

2. **Alerting**
```yaml
# Set up alerts for:
# - High error rates
# - Slow response times  
# - Resource exhaustion
# - Integration failures
```

## 🎯 Post-Deployment Checklist

### Immediate Verification
- [ ] Frontend loads correctly on all devices
- [ ] All widgets function properly
- [ ] Backend API responds to health checks
- [ ] Agent TARS automation is running
- [ ] SSL certificates are active
- [ ] Analytics tracking is working

### Integration Testing
- [ ] Notion integration creates templates
- [ ] Brevo sends test emails successfully
- [ ] Facebook posts appear in group
- [ ] Google Drive monitoring works
- [ ] Archetype routing functions correctly

### Performance Verification
- [ ] Page load times under 3 seconds
- [ ] API response times under 500ms
- [ ] No console errors in browser
- [ ] Mobile responsiveness confirmed
- [ ] Cross-browser compatibility verified

### Security Verification
- [ ] HTTPS enforced on all domains
- [ ] API keys secured and not exposed
- [ ] CORS properly configured
- [ ] No sensitive data in logs
- [ ] Error messages don't leak information

---

*Remember: Deployment is just the beginning. Monitor, iterate, and continuously improve the soul-aligned experience for your community.*

🧬 **Your digital sovereignty portal is now live and ready to transform lives!** 🧬

