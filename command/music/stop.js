const CommandBase = require('../CommandBase');

module.exports = class Stop extends CommandBase {
    constructor(player) {
        super();
        this.names = ['stop', 'quit'];
        this.help = 'Stop the current song or playlist and the bot leave the current voice channel.';
        this.player = player;
    }

    run(msg, args) {
        this.player.stop(msg);
    }
};