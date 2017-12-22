const CommandBase = require('../CommandBase');

module.exports = class Pause extends CommandBase {
    constructor(player) {
        super();
        this.names = ['pause'];
        this.help = 'Pause the current playing song.';
        this.player = player;
    }

    run(msg, args) {
        this.player.pause(msg);
    }
};