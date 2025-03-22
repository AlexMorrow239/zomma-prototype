# Railway Deployment Guide

This document provides detailed instructions for deploying the frontend application to Railway.

## Prerequisites

- Railway account (sign up at [railway.app](https://railway.app))
- Railway CLI installed (`npm install -g @railway/cli`)
- Git repository with your code

## Configuration Files

The deployment is configured using:

1. `railway.json` - Main configuration file for Railway
2. `.env.production` - Environment variables for production

## Deployment Process

### 1. Initial Setup

1. Create a new project in Railway dashboard or use the CLI:

   ```
   railway init
   ```

2. Link your local project to Railway:
   ```
   railway link
   ```

### 2. Environment Variables

Set up the required environment variables in the Railway dashboard:

- `API_URL`: URL of your backend API (e.g., https://api.yourdomain.com)

These variables will be used during the build and runtime to configure your application.

### 3. Deployment

Deploy your application using:

```
railway up
```

Or push to your linked Git repository to trigger an automatic deployment.

### 4. Custom Domain (Optional)

1. Navigate to your project in the Railway dashboard
2. Go to the "Settings" tab
3. Under "Domains", add your custom domain
4. Configure DNS records as instructed in the Railway dashboard

## Troubleshooting

### Build Failures

If your build fails, check the build logs in the Railway dashboard. Common issues include:

- Missing dependencies
- Environment variable configuration issues
- Build script errors

### Runtime Errors

If your application fails to start or doesn't work as expected:

1. Check the logs in the Railway dashboard
2. Verify environment variables are correctly set
3. Test your application locally with production variables:
   ```
   npm run build && npx serve -s dist
   ```

## Monitoring

Railway provides basic monitoring capabilities:

- View logs in the Railway dashboard
- Monitor deployment status and health checks

For more advanced monitoring, consider integrating with Sentry (configured in `.env.production`).
