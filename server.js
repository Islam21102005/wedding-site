const express = require('express');
const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Telegram Bot Configuration
const TELEGRAM_BOT_TOKEN = '7951775121:AAGwQ2YJUV1RpSat5EPPsWiB_tbMUbijQ3k';
const TELEGRAM_CHAT_ID = '5076615429'; // Замените на ваш chat_id

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: false });

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

// Handle form submission
app.post('/submit-rsvp', async (req, res) => {
  try {
    const { name, attendance, drinks, food } = req.body;

    // Create message for Telegram
    const message = `
🎊 НОВАЯ АНКЕТА ГОСТЯ 🎊

👤 Имя: ${name}
📅 Присутствие: ${attendance}
🍷 Алкоголь: ${drinks}
🍽 Еда/Аллергия: ${food}
    `;

    // Send to Telegram
    await bot.sendMessage(TELEGRAM_CHAT_ID, message);

    res.json({ success: true, message: 'Спасибо! Ваша анкета отправлена.' });
  } catch (error) {
    console.error('Error sending to Telegram:', error);
    res.status(500).json({ success: false, message: 'Ошибка отправки. Попробуйте позже.' });
  }
});

app.listen(PORT, () => {
  console.log(`🎉 Сервер запущен на http://localhost:${PORT}`);
});
