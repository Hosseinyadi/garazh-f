# Backend Deployment Guide (Production)

This guide prepares and deploys the Node.js/Express backend on a real server with PM2 and Nginx.

## 1) Prerequisites

- Linux server (Ubuntu 20.04/22.04 recommended)
- Node.js 18+ and npm
- PM2 process manager
- Nginx (as reverse proxy)
- A domain (optional)

## 2) Environment variables

Create `server/.env` using this template and set secure values:

```
# Runtime
NODE_ENV=production
PORT=8080

# Security (REQUIRED)
JWT_SECRET=<CHANGE_TO_A_LONG_RANDOM_SECRET>

# CORS / Frontend origins (comma-separated)
ALLOWED_ORIGINS=https://example.com,https://www.example.com
FRONTEND_URL=https://example.com

# Request body limits
BODY_LIMIT=10mb

# Rate limits
RATE_LIMIT_MAX=200
OTP_RATE_LIMIT_MAX=3
LOGIN_RATE_LIMIT_MAX=50

# OTP mock (KEEP FALSE in production)
OTP_MOCK=false

# Database (optional)
DB_PATH=/var/app/data/bilflow.db

# SMS provider configuration
SMS_PROVIDER=smsir
SMS_IR_API_KEY=<YOUR_SMS_IR_API_KEY>
SMS_IR_VERIFY_URL=https://api.sms.ir/v1/send/verify
SMS_IR_TEMPLATE_ID=123456
SMS_SANDBOX=false

# Or Payamak-panel
SMS_PROVIDER=payamak
SMS_API_TOKEN=
SMS_BASE_URL=https://api.payamak-panel.com/api/SendSMS/SendSMS
SMS_USERNAME=
SMS_PASSWORD=
SMS_FROM=
```

Notes:
- `JWT_SECRET` must be set in production (server will refuse to start otherwise).
- `ALLOWED_ORIGINS` must include your frontend origin(s).
- Set `OTP_MOCK=false` in production.
- Use `DB_PATH` to store SQLite DB under a persistent path (e.g., `/var/app/data/bilflow.db`).

## 3) Install dependencies

On the server (inside the `server/` folder):

```bash
npm ci
# Optional but recommended for better performance/logging
npm i compression morgan
```

## 4) PM2 process

We provide `server/ecosystem.config.js`. Start and persist:

```bash
# From the project root or server/ folder
cd server
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup  # follow instructions to enable auto-start on reboot
```

Useful PM2 commands:

```bash
pm2 list
pm2 logs bil-flow-server
pm2 reload bil-flow-server
pm2 restart bil-flow-server
```

## 5) Nginx reverse proxy

Example `/etc/nginx/sites-available/bilflow.conf`:

```
server {
    listen 80;
    server_name api.example.com;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable and reload:

```bash
sudo ln -s /etc/nginx/sites-available/bilflow.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

For HTTPS, use Certbot (Let’s Encrypt):

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d api.example.com
```

## 6) Health checks & quick tests

```bash
curl http://127.0.0.1:8080/health
curl -X POST http://127.0.0.1:8080/api/auth/admin/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"admin","password":"admin123"}'

curl -X POST http://127.0.0.1:8080/api/auth/send-otp \
  -H 'Content-Type: application/json' \
  -d '{"phone":"+989123456789"}'
```

## 7) Operational best practices

- Take regular backups of the SQLite DB file at `DB_PATH`.
- Monitor logs with `pm2 logs` and metrics with `pm2 monit`.
- Keep `OTP_MOCK=false` in production. Test OTPs on staging instead.
- Keep `ALLOWED_ORIGINS` up to date with frontend domains.
- Use `helmet`, `compression`, `express-rate-limit` (already integrated).
- Update SMS provider keys regularly.

## 8) Scaling notes

- For low to medium traffic, SQLite with WAL mode is fine. For larger scale, consider PostgreSQL/MySQL.
- `ecosystem.config.js` runs in cluster mode to use multiple CPU cores.

## 9) Troubleshooting

- 403 or CORS errors: verify `ALLOWED_ORIGINS` and Nginx proxy headers.
- OTP not delivered: check SMS provider credentials; see backend logs; ensure country format (+98/09) is correct.
- 429 Too Many Requests: rate limiters (login/otp) triggered — adjust env values.
- Server refuses to start: ensure `JWT_SECRET` is set when `NODE_ENV=production`.
