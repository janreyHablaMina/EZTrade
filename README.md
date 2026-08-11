# EZTrade

Monorepo for EZTrade.

```
eztrade/
├── app/   # React Native + Expo
├── web/   # Next.js
└── api/   # Laravel
```

## Setup

```bash
npm install
composer install --working-dir=api
php api/artisan key:generate
```

## Develop

```bash
npm run dev:web     # Next.js → http://localhost:3000
npm run dev:app     # Expo
npm run dev:api     # Laravel → http://localhost:8000
```
