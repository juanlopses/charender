const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Servir archivos estáticos

// Ruta del archivo JSON para almacenar mensajes
const MESSAGES_FILE = path.join(__dirname, 'messages.json');

// Función para leer mensajes del archivo JSON
function readMessages() {
    if (!fs.existsSync(MESSAGES_FILE)) {
        fs.writeFileSync(MESSAGES_FILE, JSON.stringify([])); // Crear archivo si no existe
    }
    const data = fs.readFileSync(MESSAGES_FILE, 'utf8');
    return JSON.parse(data);
}

// Función para escribir mensajes en el archivo JSON
function writeMessages(messages) {
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2));
}

// Rutas
app.get('/messages', (req, res) => {
    try {
        const messages = readMessages();
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener mensajes' });
    }
});

app.post('/messages', (req, res) => {
    try {
        const { text } = req.body;
        const messages = readMessages();
        messages.push({ text, createdAt: new Date().toISOString() });
        writeMessages(messages);
        res.status(201).json({ message: 'Mensaje guardado' });
    } catch (err) {
        res.status(500).json({ error: 'Error al guardar el mensaje' });
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
