const CommandBase = require('../CommandBase');

module.exports = class Resume extends CommandBase {
    constructor(player) {
        super();
        this.names = ['resume'];
        this.help = 'Resume the current playing song.';
        this.player = player;
    }

    run(msg, args) {
        this.player.resume(msg);
    }
};