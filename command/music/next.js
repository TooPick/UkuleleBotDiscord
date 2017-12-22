const CommandBase = require('../CommandBase');

module.exports = class Next extends CommandBase {
    constructor(player) {
        super();
        this.names = ['next'];
        this.help = 'Play the next song in the queue.';
        this.player = player;
    }

    run(msg, args) {
        this.player.next(msg);
    }
};