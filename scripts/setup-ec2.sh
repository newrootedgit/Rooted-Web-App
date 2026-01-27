#!/bin/bash
set -e

APP_DIR="/var/www/rooted"
RDS_ENDPOINT="$1"
DB_PASSWORD="$2"
LAMBDA_SECRET="$3"
CLERK_PUBLISHABLE_KEY="$4"
CLERK_SECRET_KEY="$5"

if [ -z "$RDS_ENDPOINT" ] || [ -z "$DB_PASSWORD" ]; then
  echo "Usage: ./setup-ec2.sh <RDS_ENDPOINT> <DB_PASSWORD> <LAMBDA_SECRET> <CLERK_PUB_KEY> <CLERK_SECRET_KEY>"
  exit 1
fi

echo "🔧 Setting up EC2 instance..."

# Install dependencies (if not already done by user_data)
echo "📦 Installing dependencies..."
sudo apt-get update
command -v node || (curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && sudo apt-get install -y nodejs)
command -v pnpm || sudo npm install -g pnpm
command -v nginx || sudo apt-get install -y nginx
command -v docker || (curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh && sudo usermod -aG docker ubuntu)
command -v pm2 || sudo npm install -g pm2

# Start Redis
echo "🐳 Starting Redis..."
docker ps | grep rooted-redis || docker run -d \
  --name rooted-redis \
  --restart unless-stopped \
  -p 127.0.0.1:6379:6379 \
  redis:7-alpine

# Install API dependencies
echo "📦 Installing API dependencies..."
cd $APP_DIR/apps/api
pnpm install --prod --frozen-lockfile

# Create environment files
echo "📝 Creating environment files..."
cat > .env.production << EOF
NODE_ENV=production
DATABASE_URL=postgresql://rooted:${DB_PASSWORD}@${RDS_ENDPOINT}:5432/rooted_planner
REDIS_URL=redis://localhost:6379
CLERK_PUBLISHABLE_KEY=${CLERK_PUBLISHABLE_KEY}
CLERK_SECRET_KEY=${CLERK_SECRET_KEY}
LAMBDA_SECRET_TOKEN=${LAMBDA_SECRET}
AWS_REGION=us-west-2
LOG_LEVEL=info
PORT=8000
EOF

# Run migrations
echo "🗄️  Running database migrations..."
cp .env.production .env
pnpm prisma generate
pnpm prisma migrate deploy

# Configure Nginx
echo "🌐 Configuring Nginx..."
sudo tee /etc/nginx/sites-available/rooted > /dev/null << 'NGINX_EOF'
server {
    listen 80;
    server_name app.rootedrobotics.com;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;

    location = /admin {
        root /var/www/rooted/dist;
        try_files /admin.html =404;
    }

    location /admin/ {
        alias /var/www/rooted/dist/;
        try_files $uri /admin.html;
    }

    location /api/ {
        proxy_pass http://localhost:8000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    location / {
        root /var/www/rooted/dist;
        try_files $uri /index.html;
    }
}
NGINX_EOF

sudo ln -sf /etc/nginx/sites-available/rooted /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx

# Create PM2 ecosystem
echo "⚙️  Creating PM2 config..."
cat > ecosystem.config.cjs << 'PM2_EOF'
module.exports = {
  apps: [{
    name: 'rooted-api',
    script: 'node',
    args: 'dist/index.js',
    cwd: '/var/www/rooted/apps/api',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
    },
  }]
};
PM2_EOF

# Start API
echo "🚀 Starting API..."
set -a; source .env.production; set +a
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup | tail -n 1 | sudo bash

# Health check
echo "🏥 Checking health..."
sleep 5
curl -f http://localhost:8000/health || echo "⚠️  Health check failed"

echo ""
echo "✅ Setup complete!"
echo "📍 Point Cloudflare DNS to: $(curl -s ifconfig.me)"
echo "🔍 Check logs: pm2 logs rooted-api"
