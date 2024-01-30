const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Define la ruta al directorio que contiene los archivos estáticos
const staticPath = path.join(__dirname, './PruebaAframe');

// Utiliza express.static() para servir archivos estáticos desde el directorio
app.use(express.static(staticPath));

// Configura una ruta para el archivo HTML principal
app.get('/', (req, res) => {
  res.sendFile(path.join(staticPath, 'index3.html'));
});

// Inicia el servidor en el puerto especificado
app.listen(port,'192.168.1.132', () => {
  console.log(`Servidor en http://localhost:${port}`);
  console.log(`Servidor en http://192.168.1.132:${port}`);
});

