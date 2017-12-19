const youtubeS = require('youtube-search');
const ytdl = require('ytdl-core');

module.exports = function(client, options){
    // Get all options.
    let PREFIX = (options && options.prefix) || '!';
    const YOUTUBE_API_KEY = (options && options.youtube_api_key) || '';
    let DEFAULT_VOLUME = (options && options.volume) || 50;

    //List of client Queues
    let musicQueues = [];

    client.on('message', msg => {
        const message = msg.content.trim();

        // Check if the message is a command.
        if (message.startsWith(PREFIX)) {
            // Get the command and suffix.
            const command = message.split(/[ \n]/)[0].substring(PREFIX.length).toLowerCase().trim();
            const suffix = message.substring(PREFIX.length + command.length).trim();

            // Process the commands.
            switch (command) {
                case 'play': return play(msg, suffix);
                case 'pause': return pause(msg, suffix);
                case 'resume': return resume(msg, suffix);
                case 'next': return next(msg, suffix);
                case 'volume': return volume(msg, suffix);
                case 'clear': return clearQueue(msg, suffix);
                case 'quit': return quit(msg, suffix);
                case 'help': return help(msg, suffix);
            }
        }
    });

    /**
     * Return the music queue of the current server.
     */
    function getServerQueue(server) {
        // Return the queue.
        if (!musicQueues[server]) musicQueues[server] = [];
        return musicQueues[server];
    }

    /**
     * Search in Youtube with Youtube API.
     */
    function youtubeSearch(keywords, maxResults, callback) {
        const opts = {
            maxResults: maxResults,
            key: YOUTUBE_API_KEY
        };

        youtubeS(keywords, opts, callback);
    }

    /**
     * Search a song in Youtube with de provides key words or Youtube link, if a song is already playing, add the song to queue.
     */
    function play(msg, suffix) {
        // Make sure the user is in a voice channel.
        if (msg.member.voiceChannel === undefined) return msg.channel.send(wrap("Vous n'êtes pas dans un salon vocal !"));

        // Make sure the suffix exists.
        if (!suffix) return msg.channel.send(wrap('Aucune vidéo trouvée !'));

        // Get the queue.
        const queue = getServerQueue(msg.guild.id);

        // Get the video information.
        msg.channel.send(wrap('Recherche en cours...')).then(response => {
            youtubeSearch(suffix, 1, (err, results) => {
                if(err)
                    return console.error(err);

                if(results.length <= 0) {
                    // No result
                    response.edit(wrap("Aucune chanson trouvée !"));
                }
                else {
                    // Queue the video.
                    response.edit(wrap("Chanson trouvée : \n" + results[0].title + "\n" + results[0].link)).then(response => {
                        queue.push(results[0]);

                        // Play if only one element in the queue.
                        if (queue.length === 1)
                            playQueue(msg, queue);
                        else
                            msg.channel.send(wrap("Ajout à la liste d'attente !"));
                    });
                }
            });
        }).catch(err => {
            console.error(err);
        });
    }

    /**
     * Create the audio stream from youtube, and play all songs in the queue.
     */
    function playQueue(msg, queue) {
        // If the queue is empty, finish.
        if (queue.length === 0) {
            msg.channel.send(wrap("Liste d'attente terminée !"));

            // Leave the voice channel.
            const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id === msg.guild.id);
            if (voiceConnection !== null) return voiceConnection.disconnect();
        }

        new Promise((resolve, reject) => {
            // Join the voice channel if not already in one.
            const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id === msg.guild.id);

            if (voiceConnection === null) {
                // Check if the user is in a voice channel.
                if (msg.member.voiceChannel) {
                    msg.member.voiceChannel.join().then(connection => {
                        resolve(connection);
                    }).catch((error) => {
                        console.log(error);
                    });
                } else {
                    // Otherwise, clear the queue and do nothing.
                    queue.splice(0, queue.length);
                    reject();
                }
            } else {
                resolve(voiceConnection);
            }
        }).then(connection => {
            // Get the first item in the queue.
            const song = queue[0];

            // Play the video.
            msg.channel.send(wrap('Lecture en cours : ' + song.title)).then(() => {
                let dispatcher = connection.playStream(ytdl(song.link, {filter: 'audioonly'}), {seek: 0, volume: (DEFAULT_VOLUME/100)});

                connection.on('error', (error) => {
                    // Skip to the next song.
                    console.log(error);
                    queue.shift();
                    playQueue(msg, queue);
                });

                dispatcher.on('error', (error) => {
                    // Skip to the next song.
                    console.log(error);
                    queue.shift();
                    playQueue(msg, queue);
                });

                dispatcher.on('end', () => {
                    // Wait a second.
                    setTimeout(() => {
                        if (queue.length > 0) {
                            // Remove the song from the queue.
                            queue.shift();
                            // Play the next song in the queue.
                            playQueue(msg, queue);
                        }
                    }, 1000);
                });
            }).catch(err => {
                console.log(err);
            });

        }).catch(err => {
            console.log(err);
        });
    }

    /**
     * Pause the current song.
     */
    function pause(msg, suffix) {
        // Get the voice connection.
        const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id === msg.guild.id);
        if (voiceConnection === null) return msg.channel.send(wrap('Aucune chanson en cours de lecture.'));

        // Pause.
        msg.channel.send(wrap('Lecture en pause.'));
        const dispatcher = voiceConnection.player.dispatcher;
        if (!dispatcher.paused) dispatcher.pause();
    }

    /**
     * Resume the current song.
     */
    function resume(msg, suffix) {
        // Get the voice connection.
        const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id === msg.guild.id);
        if (voiceConnection === null) return msg.channel.send(wrap('Aucune chanson en cours de lecture.'));

        // Pause.
        msg.channel.send(wrap('Lecture en cours.'));
        const dispatcher = voiceConnection.player.dispatcher;
        if (dispatcher.paused) dispatcher.resume();
    }

    /**
     * Play the next song in the queue.
     */
    function next(msg, suffix) {
        // Get the voice connection.
        const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id === msg.guild.id);
        if (voiceConnection === null) return msg.channel.send(wrap('Aucune chanson en cours de lecture.'));

        // Next.
        msg.channel.send(wrap('Chanson suivante.'));

        voiceConnection.player.dispatcher.end();
    }

    /**
     * Set the music volume, beetween 0 and 100.
     */
    function volume(msg, suffix) {
        // Get the voice connection.
        const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id === msg.guild.id);
        if (voiceConnection === null) return msg.channel.send(wrap('Aucune chanson en cours de lecture.'));

        // Get the dispatcher
        const dispatcher = voiceConnection.player.dispatcher;

        if (suffix > 100 || suffix < 0)
            suffix = 100;

        msg.channel.send(wrap("Volume défini à " + suffix));
        dispatcher.setVolume((suffix/100));
    }

    /**
     * Clear the current queue.
     */
    function clearQueue(msg, suffix) {
        // Get the voice connection.
        const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id === msg.guild.id);
        if (voiceConnection === null) return msg.channel.send(wrap('Aucune chanson en cours de lecture.'));

        const queue = getServerQueue(msg.guild.id);
        queue.splice(0, queue.length);

        msg.channel.send(wrap("Liste d'attente vidée !"));
    }

    function quit(msg, suffix) {
        // Get the voice connection.
        const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id === msg.guild.id);

        if (voiceConnection !== null) {
            const queue = getServerQueue(msg.guild.id);
            queue.splice(0, queue.length);

            msg.channel.send(wrap("Ok... Je me casse !"));

            // End the stream and disconnect.
            voiceConnection.player.dispatcher.end();
            voiceConnection.disconnect();
        }
    }

    /**
     * Display the commands list.
     */
    function help(msg, suffix) {
        let helpStr = "";
        helpStr += "!play [mots_cles] - Recherche une chanson sur YouTube puis l'ajoute à la liste de lecture. \n";
        helpStr += "!pause - Met en pause la lecture en cours. \n";
        helpStr += "!resume - Met en lecture la lecture mise en pause. \n";
        helpStr += "!next - Passe à la prochaine chanson de la liste d'attente. \n";
        helpStr += "!volume [0-100] - Défini le volume sonore de la lecture (entre 0 et 100). \n";
        helpStr += "!clear - Vide la liste d'attente. \n";
        helpStr += "!quit - Stoppe la lecture et le bot sort du salon vocal. \n";
        helpStr += "!help - Affiche cette fiche d'aide ^^. \n";

        msg.channel.send(wrap(helpStr));
    }

    /**
     * Wrap the text content for a better display in the text channel.
     */
    function wrap(text) {
        return '```\n' + text.replace(/`/g, '`' + String.fromCharCode(8203)) + '\n```';
    }
};