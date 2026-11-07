const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');

const app = express();
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}
const preferredPort = Number(process.env.PORT || 3000);
const rootDir = __dirname;
const webDistPath = path.join(rootDir, 'apps', 'kahvi-panda', 'web', 'dist');
const apiRouterPath = path.join(rootDir, 'apps', 'kahvi-panda', 'api', 'dist', 'routes', 'index.js');

if (!fs.existsSync(webDistPath) || !fs.existsSync(apiRouterPath)) {
  console.error('Production build is incomplete. Run "npm run build" before starting the server.');
  process.exit(1);
}

const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`🐼 Kahvi Panda single-host app running on http://localhost:${port}`);
  });

  server.on('error', (error) => {
    console.error('Failed to start Kahvi Panda single-host app.', error);
    process.exit(1);
  });
};

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
app.use('/api', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests from this IP, please try again in a few minutes.' }
}));

app.get('/health', (_req, res) => {
  res.json({
    status: 'healthy',
    app: 'Kahvi Panda single-host',
    timestamp: new Date().toISOString(),
  });
});

const apiModule = require(apiRouterPath);
const apiRouter = apiModule.default || apiModule;
app.use('/api/v1', apiRouter);
app.use('/api', apiRouter);

app.use(express.static(webDistPath));
app.get(/^\/(?!api).*/, (_req, res) => {
  res.sendFile(path.join(webDistPath, 'index.html'));
});

startServer(preferredPort);
