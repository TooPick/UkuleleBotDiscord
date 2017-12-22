const CommandBase = require('../CommandBase');
const Message = require('../../util/Message');

module.exports = class PlaylistList extends CommandBase {
    constructor(botApiManager) {
        super();
        this.names = ['list'];
        this.group = 'playlist';
        this.help = 'List all the playlist available in the server.';
        this.botApiManager = botApiManager;
    }

    run(msg, args) {
        this.botApiManager.getAllPlaylist(function(err, playlists) {
            if(err)
                return console.error(err);

            let text = "";
            if(playlists && playlists.length > 0) {
                text = "Playlists disponible :\n";
                for(let i = 0; i < playlists.length; i++) {
                    text += `\t- ${playlists[i].name} (${playlists[i].songs.length} chansons).\n`;
                }
            } else {
                text = "Aucune playlist trouvée !";
            }

            msg.channel.send(Message.wrap(text));
        });
    }
};