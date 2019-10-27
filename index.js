const config = require('./config');
const Telegraf = require('telegraf');
const bot = new Telegraf(config.botToken);
bot.start((ctx) => {
    return ctx.reply('Добро пожаловать!');
});
bot.launch();