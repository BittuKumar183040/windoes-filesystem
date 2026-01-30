import express from 'express';
var router = express.Router();

router.get('/', (req, res) => {

  res.json({
    name: 'File Explorer Service',
    description: 'This service is ment for having file operation',
    environment: process.env.NODE_ENV || 'development',
    uptime: `${Math.floor(process.uptime())}s`,
    time: new Date().toISOString()
  });
});

export default router;
