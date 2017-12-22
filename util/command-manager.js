const Message = require('./Message');

module.exports = class CommandManager {

    constructor(Bot, options) {
        this.commands = [];
        this.prefix = (options && options.prefix) || '!';
        this.helpTxt = "";

        Bot.on('message', msg => {
            this.parseMsg(msg);
        });
    }

    createHelpTxt(command) {
        let text = "";
        text += this.prefix + command.names[0] + " - " + command.help;
        if(command.names.length > 1) {
            let aliasesText = " (Aliases: ";
            for(var i = 1; i < command.names.length; i++) {
                aliasesText += this.prefix + command.names[i];
                if(i !== (command.names.length - 1))
                    aliasesText += ", ";
            }
            aliasesText += ")";
            text += aliasesText;
        }
        text += "\n";
        return text;
    }

    loadCommand(command) {
        for(let i = 0; i < command.names.length; i++) {
            if(command.group) {
                if (!this.commands[command.group]) this.commands[command.group] = [];
                this.commands[command.group][command.names[i]] = command;
            }
            else
                this.commands[command.names[i]] = command;
        }

        if(command.displayHelp)
            this.helpTxt += this.createHelpTxt(command);
    }

    parseMsg(msg) {
        const messageTxt = msg.content.trim();
        // Check if the message is a command.
        if (messageTxt.startsWith(this.prefix)) {
            // Command without prefix
            const command = messageTxt.substring(this.prefix.length);
            let commandName = command.split(' ')[0].trim();
            let commandParams = command.substring(commandName.length).trim();

            if(commandName in this.commands) {
                // Command in command group
                if(Array.isArray(this.commands[commandName])) {
                    const commandGroup = commandName;
                    commandName = commandParams.split(' ')[0].trim();
                    commandParams = commandParams.substring(commandName.length).trim();

                    if(commandName in this.commands[commandGroup]) {
                        // Exec the command in command group
                        this.commands[commandGroup][commandName].run(msg, commandParams);
                    } else {
                        // Command not found
                        msg.channel.send(Message.wrap("La commande demandée n'a pas été trouvée !"));
                    }
                }
                // No command group
                else {
                    // Exec the command
                    this.commands[commandName].run(msg, commandParams);
                }
            } else {
                if(commandName === 'help') {
                    // Display the help command
                    this.helpCommand(msg);
                }
                else {
                    // Command not found
                    msg.channel.send(Message.wrap("La commande demandée n'a pas été trouvée !"));
                }
            }
        }
    }

    helpCommand(msg) {
        msg.channel.send(Message.wrap(this.helpTxt));
    }
};