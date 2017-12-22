module.exports = class CommandBase {
    constructor() {
        this.names = [''];
        this.group = null;
        this.displayHelp = true;
        this.help = '';
    }

    run(msg, args) {

    }
};