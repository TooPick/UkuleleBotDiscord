const options = require('./options');
const Discord = require('discord.js');
const Player = require('./util/Player');
const CommandManager = require('./util/command-manager');
const BotApiManager = require('./util/BotApiManager');

// Include all commands
//      Music commands
const MusicPlayCmd = require('./command/music/play');
const MusicPauseCmd = require('./command/music/pause');
const MusicResumeCmd = require('./command/music/resume');
const MusicStopCmd = require('./command/music/stop');
const MusicClearCmd = require('./command/music/clear');
const MusicVolumeCmd = require('./command/music/volume');
const MusicNextCmd = require('./command/music/next');

//      Playlist commands
const PlaylistPlayCmd = require('./command/playlist/playlist-play');
const PlaylistListCmd = require('./command/playlist/playlist-list');

//      Easter Egg commands
const YenniCmd = require('./command/easter-egg/yenni');

// Init the Discord Bot
const Bot = new Discord.Client();

// Init the Bot API Manager
const botApiManager = new BotApiManager(options.bot_api_username, options.bot_api_password, options.bot_api_endpoint);

// Init music player
const player = new Player(Bot, botApiManager);


// Init command manager
const commandManager = new CommandManager(Bot, options);

// Load all commands
//      Music commands
console.log("Loading commands...");
commandManager.loadCommand(new MusicPlayCmd(player));
commandManager.loadCommand(new MusicPauseCmd(player));
commandManager.loadCommand(new MusicResumeCmd(player));
commandManager.loadCommand(new MusicStopCmd(player));
commandManager.loadCommand(new MusicClearCmd(player));
commandManager.loadCommand(new MusicVolumeCmd(player));
commandManager.loadCommand(new MusicNextCmd(player));

//      Playlist commands
commandManager.loadCommand(new PlaylistPlayCmd(player, botApiManager));
commandManager.loadCommand(new PlaylistListCmd(botApiManager));

//      Easter Egg commands
commandManager.loadCommand(new YenniCmd(player));

console.log("Commands loaded !");

// Connect the bot
Bot.login(options.bot_token);
console.log("Ukulélé Bot started !");