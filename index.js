const config = require('./config');
const Telegraf = require('telegraf');
const Telegram = require('telegraf/telegram')
const Transmission = require('transmission')
const https = require('https');
const fs = require('fs');

const transmission = new Transmission();
const bot = new Telegraf(config.botToken);
const telegram = new Telegram(config.botToken)
bot.start((ctx) => {
    return ctx.reply('Welcome! Please send magnet link or drop torrent files here.');
});
bot.on('message', (ctx) => {
    console.log(ctx.message);
    if (ctx.message.document) {
        telegram.getFileLink(ctx.message.document.file_id).then(fileLink => {
            let fileName = fileLink.split('/').pop();
            let extension = fileName.split('.').pop();
            if (extension === 'torrent') {
                try {
                    transmission.addUrl(fileLink, (err, arg) => {
                        if (err) {
                            ctx.reply("Link parse error");
                        } else {
                            ctx.reply('Torrent file added!');
                        }
                    });
                } catch (ex) {
                    ctx.reply('File download error.');
                }
            } else {
                ctx.reply('This is not a torrent file!');
            }
        })
    } else if (ctx.message.text) {
        const magnetRegex = /^magnet.+$/i;
        if (magnetRegex.test(ctx.message.text)) {
            transmission.addUrl(ctx.message.text, (err, arg) => {
                if (err) {
                    ctx.reply("Link parse error");
                } else {
                    ctx.reply('Magnet link is parsed!');
                }
            });
        } else {
            ctx.reply('This is not a magnet link!');
        }
    }
});
bot.launch();