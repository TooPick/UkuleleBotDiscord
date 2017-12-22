const CommandBase = require('../CommandBase');

module.exports = class Clear extends CommandBase {
    constructor(player) {
        super();
        this.names = ['clear'];
        this.help = 'Clear the current queue.';
        this.player = player;
    }

    run(msg, args) {
        this.player.clearQueue(msg);
    }
};