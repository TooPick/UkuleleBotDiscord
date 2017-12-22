const CommandBase = require('../CommandBase');
const YoutubeSearch = require('../../util/YoutubeSearch');
const Message = require('../../util/Message');

module.exports = class Play extends CommandBase {
    constructor(player) {
        super();
        this.names = ['play'];
        this.help = 'Search a Youtube song by keywords or url and play it.';
        this.player = player;
    }

    run(msg, args) {
        msg.channel.send(Message.wrap("Recherche en cours...")).then(response => {
            YoutubeSearch.search(args, 1, (err, results) => {
                // TODO : better error handling
                if(err)
                    return console.log(err);

                if(results.length <= 0) {
                    // No result
                    response.edit(Message.wrap("Aucune chanson trouvée !"));
                }
                else {
                    // Queue the video.
                    response.edit(Message.wrap("Chanson trouvée : \n" + results[0].title + "\n" + results[0].link)).then(response => {
                        this.player.addToQueue(msg.guild.id, results[0]);

                        // Play if only one element in the queue.
                        if (this.player.queueSize(msg.guild.id) === 1)
                            this.player.playQueue(msg);
                        else
                            msg.channel.send(Message.wrap("Ajout à la liste d'attente !"));
                    });
                }
            });
        })

    }
};