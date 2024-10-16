const express = require('express');
const app = express();

// Servir archivos estáticos (HTML, CSS, JS)
app.use(express.static('public'));

// Configurar el puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
