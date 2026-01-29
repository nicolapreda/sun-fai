const express = require('express');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcrypt');
const multer = require('multer');
const db = require('./src/database');
const { getInstantPowers } = require("./src/ardake.service")

const app = express();

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration
app.use(session({
    secret: 'sun-fai-secret-key-change-this', // In production, use environment variable
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'public/uploads/'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Authentication Middleware
const requireAuth = (req, res, next) => {
    if (req.session.userId) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

// Page Routes
app.get('/', async (req, res) => {
    db.all("SELECT * FROM news ORDER BY date DESC LIMIT 3", [], async (err, news) => {
        if (err) return res.status(500).send(err.message);
        
        db.all("SELECT * FROM events WHERE date >= date('now') ORDER BY date ASC LIMIT 3", [], async (err, events) => {
            if (err) return res.status(500).send(err.message);
            
            try {
                const energyData = await getInstantPowers();
                res.render('index', { news, events, dailyMonitor: energyData.data, totalPower: energyData.powerSum });
            } catch (error) {
                console.error('Error fetching instant powers:', error);
                res.render('index', { news, events, instantPowers: [], totalPower: 0 });
            }
        });
    });
});
app.get('/index.html', (req, res) => res.redirect('/')); // Redirect legacy link
app.get('/chi-siamo', (req, res) => res.render('chi-siamo'));
app.get('/chi-siamo.html', (req, res) => res.redirect('/chi-siamo'));
app.get('/cosa-facciamo', (req, res) => res.render('cosa-facciamo'));
app.get('/cosa-facciamo.html', (req, res) => res.redirect('/cosa-facciamo'));
app.get('/le-cer', (req, res) => res.render('le-cer'));
app.get('/le-cer.html', (req, res) => res.redirect('/le-cer'));
app.get('/notizie', (req, res) => res.render('notizie'));
app.get('/notizie.html', (req, res) => res.redirect('/notizie'));

app.get('/diventa-socio', (req, res) => res.render('diventa-socio'));
app.get('/diventa-socio.html', (req, res) => res.redirect('/diventa-socio'));

// API Routes

// Login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        bcrypt.compare(password, user.password, (err, result) => {
            if (result) {
                req.session.userId = user.id;
                res.json({ message: 'Login successful' });
            } else {
                res.status(401).json({ error: 'Invalid credentials' });
            }
        });
    });
});

// Logout
app.post('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ message: 'Logout successful' });
});

// Check Auth Status
app.get('/api/check-auth', (req, res) => {
    if (req.session.userId) {
        res.json({ authenticated: true });
    } else {
        res.json({ authenticated: false });
    }
});

// Single News Page Route
app.get('/notizie/:id', (req, res) => {
    const id = req.params.id;
    db.get("SELECT * FROM news WHERE id = ?", [id], (err, row) => {
        if (err) return res.status(500).send(err.message);
        if (!row) {
            // Handle legacy/friendly URLs if needed, or simply 404
             // Verify if it is a legacy html file request, redirect to main otherwise
             if(id.endsWith('.html')) return res.redirect('/notizie');
             return res.status(404).send('Notizia non trovata');
        }
        res.render('notizia', { newsItem: row });
    });
});

// News API
app.get('/api/news', (req, res) => {
    db.all("SELECT * FROM news ORDER BY date DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/news', requireAuth, upload.single('image'), (req, res) => {
    const { title, content, date } = req.body;
    const image = req.file ? '/uploads/' + req.file.filename : null;
    
    db.run("INSERT INTO news (title, content, image, date) VALUES (?, ?, ?, ?)", 
        [title, content, image, date], 
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID, title, content, image, date });
        }
    );
});

app.put('/api/news/:id', requireAuth, upload.single('image'), (req, res) => {
    const { title, content, date } = req.body;
    const image = req.file ? '/uploads/' + req.file.filename : null;
    const id = req.params.id;

    let query = "UPDATE news SET title = ?, content = ?, date = ? WHERE id = ?";
    let params = [title, content, date, id];

    if (image) {
        query = "UPDATE news SET title = ?, content = ?, date = ?, image = ? WHERE id = ?";
        params = [title, content, date, image, id];
    }

    db.run(query, params, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Updated successfully', id, title, content, date, image });
    });
});

app.delete('/api/news/:id', requireAuth, (req, res) => {
    db.run("DELETE FROM news WHERE id = ?", [req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Deleted successfully' });
    });
});

// Events API
app.get('/api/events', (req, res) => {
    db.all("SELECT * FROM events ORDER BY date ASC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Proxy for Sun-Fai Energy Monitoring
app.get('/api/energy-status', (req, res) => {
    const https = require('https');
    const url = 'https://sun-fai.org/gestione_cer/file_server/dati_grafico_expo_energy.php';

    https.get(url, (resp) => {
        let data = '';

        resp.on('data', (chunk) => {
            data += chunk;
        });

        resp.on('end', () => {
            try {
                const parsedData = JSON.parse(data);
                res.json(parsedData);
            } catch (e) {
                console.error("Error parsing external energy data:", e);
                res.status(500).json({ error: 'Failed to parse external data' });
            }
        });

    }).on("error", (err) => {
        console.error("Error fetching external energy data:", err.message);
        res.status(500).json({ error: 'Failed to fetch external data' });
    });
});

app.post('/api/events', requireAuth, upload.none(), (req, res) => {
    const { title, description, date, location } = req.body;
    // Image handling removed
    const image = null;

    db.run("INSERT INTO events (title, description, date, location, image) VALUES (?, ?, ?, ?, ?)",
        [title, description, date, location, image],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID, title, description, date, location, image });
        }
    );
});

app.put('/api/events/:id', requireAuth, upload.single('image'), (req, res) => {
    const { title, description, date, location } = req.body;
    const image = req.file ? '/uploads/' + req.file.filename : null;
    const id = req.params.id;

    let query = "UPDATE events SET title = ?, description = ?, date = ?, location = ? WHERE id = ?";
    let params = [title, description, date, location, id];

    if (image) {
        query = "UPDATE events SET title = ?, description = ?, date = ?, location = ?, image = ? WHERE id = ?";
        params = [title, description, date, location, image, id];
    }

    db.run(query, params, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Updated successfully', id, title, description, date, location, image });
    });
});

app.delete('/api/events/:id', requireAuth, (req, res) => {
    db.run("DELETE FROM events WHERE id = ?", [req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Deleted successfully' });
    });
});



// Admin Route (serve login or dashboard based on auth is handled by frontend or separate htmls)
// We can just serve the static files from public/admin/

// Avvio del server
const PORT = process.env.PORT || 3010;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Sun-Fai Website attivo su http://0.0.0.0:${PORT}`);
  console.log(`📸 Sito web di Sun-Fai Cooperativa`);
});