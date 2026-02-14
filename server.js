/**
 * Carbon Intelligence Platform Server
 * Production-ready Express server
 */

const express = require('express');
const cors = require('cors');
const routes = require('./routes/routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Something went wrong'
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Carbon Intelligence Platform running on port ${PORT}`);
  });
}

module.exports = app;
