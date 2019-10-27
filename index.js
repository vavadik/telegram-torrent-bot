const config = require('./config');
const Telegraf = require('telegraf');
const Telegram = require('telegraf/telegram')
const https = require('https');
const fs = require('fs');

const bot = new Telegraf(config.botToken);
const telegram = new Telegram(config.botToken)
bot.start((ctx) => {
    return ctx.reply('Welcome! Please drop torrent files here.');
});
bot.on('message', (ctx) => {
    if (ctx.message.document) {
        telegram.getFileLink(ctx.message.document.file_id).then(fileLink => {
            let fileName = fileLink.split('/').pop();
            let extension = fileName.split('.').pop();
            if (extension === 'torrent') {
                try {
                    const newFile = fs.createWriteStream(`${config.torrentsFolderPath}/${fileName}`);
                    https.get(fileLink, (response) => {
                        response.pipe(newFile);
                    });
                    ctx.reply('Torrent file downloaded!');
                } catch(ex) {
                    ctx.reply('File download error.');
                }
            } else {
                ctx.reply('This is not a torrent file');
            }
        })
    }
});
bot.launch();