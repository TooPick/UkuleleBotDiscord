const CommandBase = require('../CommandBase');

module.exports = class PlaylistPlay extends CommandBase {
    constructor(player, botApiManager) {
        super();
        this.names = ['play'];
        this.group = 'playlist';
        this.help = 'Play the playlist passed in params. If it exist in the database.';
        this.player = player;
        this.botApiManager = botApiManager;
    }

    run(msg, args) {
        let player = this.player;
        this.botApiManager.getPlaylistBySlug(args, function (err, playlist) {
            if(err)
                return console.error(err);

            player.setServerPlaylist(msg.guild.id, playlist);
            player.clearQueue(msg);
            player.playQueue(msg);
        });
    }
};