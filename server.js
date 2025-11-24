const express = require('express');
const path = require('path');
const app = express();

// Middleware per servire i file statici
app.use(express.static(path.join(__dirname, 'public')));

// Route principale per il portfolio
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Avvio del server
const PORT = process.env.PORT || 3010;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Sun-Fai Website attivo su http://0.0.0.0:${PORT}`);
  console.log(`📸 Sito web di Sun-Fai Cooperativa`);
});