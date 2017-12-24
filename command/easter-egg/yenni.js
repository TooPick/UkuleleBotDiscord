const CommandBase = require('../CommandBase');

module.exports = class Yenni extends CommandBase {
    constructor(player) {
        super();
        this.names = ['yenni'];
        this.displayHelp = false;
        this.player = player;
    }

    run(msg, args) {
        this.player.playFile(msg, 'audio/yenni.mp3');
    }
};