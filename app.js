const Discord = require('discord.js');
const MusicBot = require('./music-bot');
const bot = new Discord.Client();

const config = require('./config');

bot.on('ready', () => {
    console.log('Ukulélé accordé !');
});

MusicBot(bot, {
    prefix: config.bot_carac,
    youtube_api_key: config.youtube_api_key,
});

bot.login(config.bot_token);

