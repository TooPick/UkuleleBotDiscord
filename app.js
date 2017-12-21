const Discord = require('discord.js');
const MusicBot = require('./music-bot');
const PlaylistMusicBot = require('./playlist.music-bot');
const bot = new Discord.Client();
const axios = require('axios');

const config = require('./config');

bot.on('ready', () => {
    console.log('Ukulélé accordé !');
});

var api_url = 'http://ukulele.cah-en-ligne.fr/api';
axios.post(api_url + '/login', {
    username: 'ukulele-bot',
    password: 'ukulelebotmdp',
}).then(function (response) {
    MusicBot(bot, {
        prefix: config.bot_carac,
        youtube_api_key: config.youtube_api_key,
        api_token: response.data.token,
        api_url: api_url,
    });

    bot.login(config.bot_token);
}).catch(function (error) {
    console.log(error);
});

