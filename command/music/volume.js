const CommandBase = require('../CommandBase');

module.exports = class Volume extends CommandBase {
    constructor(player) {
        super();
        this.names = ['volume', 'vol'];
        this.help = 'Set the volume to the value passed from 0 to 100.';
        this.player = player;
    }

    run(msg, args) {
        this.player.volume(msg, args);
    }
};