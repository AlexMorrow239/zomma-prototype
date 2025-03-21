# Zomma Prototype Deployment Guide for Railway

This guide explains how to deploy the Zomma Prototype monorepo to Railway with separate backend and frontend services across both development and production environments.

## Prerequisites

1. [Railway CLI](https://docs.railway.app/develop/cli) installed and authenticated
2. Access to the Railway project
3. Access to your MongoDB databases (development and production)

## Project Structure

This project is set up as a monorepo with:

- `backend/` - NestJS API
- `frontend/` - React application

Each service has its own Railway configuration for both development and production environments:

- `backend/railway.toml` - Backend development configuration
- `frontend/railway.toml` - Frontend development configuration
- `backend/railway.prod.toml` - Backend production configuration
- `frontend/railway.prod.toml` - Frontend production configuration

## Environment Variables

### Required Backend Environment Variables

```text
# Database
MONGODB_URI=mongodb+srv://username:password@your-cluster.mongodb.net/database

# JWT
JWT_SECRET=your-jwt-secret-here

# URLs
FRONTEND_URL=https://your-frontend-url
API_URL=https://your-backend-url

# Admin
ADMIN_PASSWORD=your-admin-password

# Email Configuration
SMTP_USER=your-smtp-email@example.com
SMTP_PASSWORD=your-smtp-password
SMTP_FROM_ADDRESS=your-sender-email@example.com

# Notifications
PROSPECT_NOTIFICATION_RECIPIENTS=email1@example.com,email2@example.com
```

### Required Frontend Environment Variables

```text
# API Configuration
VITE_API_URL=https://your-backend-url

# Application Configuration
VITE_APP_NAME="Zomma Portal"
VITE_APP_DESCRIPTION="Prospect intake portal for ZOMMA"
```

## Deployment Steps

### Initial Setup

If you're deploying for the first time:

```bash
railway login
```

### Deploying Backend and Frontend to Development Environment

#### Backend Development Deployment

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Link to the backend-dev service:

   ```bash
   railway link
   ```

   When prompted, select your team, project, the development environment, and the backend-dev service.

3. Set required environment variables:

   ```bash
   railway variables set MONGODB_URI=mongodb+srv://username:password@your-dev-cluster.mongodb.net/database
   railway variables set JWT_SECRET=your-dev-jwt-secret
   railway variables set FRONTEND_URL=https://frontend-dev-development.up.railway.app
   railway variables set API_URL=https://backend-dev-development.up.railway.app
   # Set other required environment variables
   ```

4. Deploy the backend:

   ```bash
   railway up
   ```

#### Frontend Development Deployment

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Link to the frontend-dev service:

   ```bash
   railway link
   ```

   When prompted, select your team, project, the development environment, and the frontend-dev service.

3. Set required environment variables:

   ```bash
   railway variables set VITE_API_URL=https://backend-dev-development.up.railway.app
   # Set other required environment variables
   ```

4. Deploy the frontend:

   ```bash
   railway up
   ```

### Deploying to Production Environment

#### Backend Production Deployment

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Link to the backend-prod service:

   ```bash
   railway link
   ```

   When prompted, select your team, project, the production environment, and the backend-prod service.

3. Set required production environment variables:

   ```bash
   railway variables set MONGODB_URI=mongodb+srv://username:password@your-prod-cluster.mongodb.net/database
   railway variables set JWT_SECRET=your-prod-jwt-secret
   railway variables set FRONTEND_URL=https://frontend-prod-production.up.railway.app
   railway variables set API_URL=https://backend-prod-production.up.railway.app
   # Set other required environment variables
   ```

4. Deploy to production using the production configuration:

   ```bash
   railway up -d railway.prod.toml
   ```

#### Frontend Production Deployment

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Link to the frontend-prod service:

   ```bash
   railway link
   ```

   When prompted, select your team, project, the production environment, and the frontend-prod service.

3. Set required production environment variables:

   ```bash
   railway variables set VITE_API_URL=https://backend-prod-production.up.railway.app
   # Set other required environment variables
   ```

4. Deploy to production using the production configuration:

   ```bash
   railway up -d railway.prod.toml
   ```

## Verifying Deployments

1. Check the deployment status:

   ```bash
   railway status
   ```

2. View service logs:

   ```bash
   railway logs
   ```

3. Open the deployed application:

   ```bash
   railway open
   ```

## Managing Multiple Environments

To switch between services and environments:

1. Use `railway link` to switch between services
2. Use different configuration files for each environment:
   - Development: `railway up` (uses default `railway.toml`)
   - Production: `railway up -d railway.prod.toml`

## Troubleshooting

- **Database Connection Issues**: Ensure that the `MONGODB_URI` is correct and that network access is allowed from Railway's IP ranges.
- **Build Failures**: Check the build logs in Railway dashboard for errors.
- **Environment Variables**: Verify that all required environment variables are set correctly.
- **DNS Issues**: Ensure custom domains are properly configured if used.
- **Deployment Errors**: Check the deployment logs in the Railway dashboard.

## Maintenance

- **Logs**: Access logs through the Railway dashboard or using `railway logs`.
- **Updates**: Push changes to your repository and run `railway up` to deploy updates.
- **Rollbacks**: Use the Railway dashboard to roll back to previous deployments if needed.

## Continuous Deployment

For continuous deployment:

1. Connect your GitHub repository to Railway
2. Configure automatic deployments for each branch:
   - `main` branch → Production environment
   - `develop` branch → Development environment

This will automatically deploy changes when you push to these branches.
