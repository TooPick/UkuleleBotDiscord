const Message = require('./Message');
const ytdl = require('ytdl-core');

module.exports = class Player {
    constructor(Bot, botApiManager) {
        this.queues = [];
        this.volumes = [];
        this.Bot = Bot;
        this.DEFAULT_VOLUME = 50;
        this.playlists = [];
        this.botApiManager = botApiManager;
    }

    addToQueue(serverId, song) {
        if (!this.queues[serverId]) this.queues[serverId] = [];

        this.queues[serverId].push(song);
    }

    clearQueue(msg) {
        if (!this.queues[msg.guild.id]) this.queues[msg.guild.id] = [];

        // Get the voice connection.
        const voiceConnection = this.Bot.voiceConnections.find(val => val.channel.guild.id === msg.guild.id);
        if (voiceConnection === null) return;

        this.queues[msg.guild.id].splice(0, this.queues[msg.guild.id].length);

        msg.channel.send(Message.wrap("Liste d'attente vidée !"));
    }

    currentSongQueue(serverId) {
        return this.queues[serverId][0];
    }

    shiftQueue(serverId) {
        this.queues[serverId].shift();
    }

    queueSize(serverId) {
        return this.queues[serverId].length;
    }

    getServerVolume(serverId) {
        if (!this.volumes[serverId]) this.volume[serverId] = this.DEFAULT_VOLUME;

        return this.volumes[serverId];
    }

    setServerVolume(serverId, volume) {
        if (!this.volumes[serverId]) this.volume[serverId] = this.DEFAULT_VOLUME;

        let volumeValue = parseInt(volume);
        if(volumeValue > 100)
            volumeValue = 100;

        if(volumeValue < 0)
            volumeValue = 0;

        this.volumes[serverId] = volumeValue;
        return volumeValue;
    }

    deleteServerVolume(serverId) {
        delete this.volumes[serverId];
    }

    getServerPlaylist(serverId) {
        if (!this.playlists[serverId]) this.playlists[serverId] = null;

        return this.playlists[serverId];
    }

    setServerPlaylist(serverId, playlist) {
        if (!this.playlists[serverId]) this.playlists[serverId] = null;

        this.playlists[serverId] = playlist;
    }

    deleteServerPlaylist(serverId) {
        delete this.playlists[serverId];
    }

    playQueue(msg) {
        // If the queue is empty, finish.
        if (this.queueSize(msg.guild.id) === 0) {
            // Play the server playlist in random
            if(this.getServerPlaylist(msg.guild.id)) {
                let self = this;
                msg.channel.send(Message.wrap(`Sélection d'une chanson dans la playlist ${this.getServerPlaylist(msg.guild.id).name}`));
                this.botApiManager.getRandomSongInPlaylist(this.getServerPlaylist(msg.guild.id).slug, function(err, song) {
                    if(err)
                        return console.error(err);

                    self.addToQueue(msg.guild.id, song);
                    return self.playQueue(msg);
                });
            }
            // End of server queue
            else {
                msg.channel.send(Message.wrap("Liste d'attente terminée !"));

                // Leave the voice channel.
                const voiceConnection = this.Bot.voiceConnections.find(val => val.channel.guild.id === msg.guild.id);
                if (voiceConnection !== null)
                    return voiceConnection.disconnect();
            }
        } else {
            new Promise((resolve, reject) => {
                // Join the voice channel if not already in one.
                const voiceConnection = this.Bot.voiceConnections.find(val => val.channel.guild.id === msg.guild.id);

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
                        this.clearQueue(msg);
                        reject();
                    }
                } else {
                    resolve(voiceConnection);
                }
            }).then(connection => {
                // Get the first item in the queue.
                const song = this.currentSongQueue(msg.guild.id);

                // Play the video.
                msg.channel.send(Message.wrap('Lecture en cours : ' + song.title)).then(() => {
                    let dispatcher = connection.playStream(ytdl(song.link, {filter: 'audioonly'}), {seek: 0, volume: (this.getServerVolume(msg.guild.id)/100)});

                    connection.on('error', (error) => {
                        // Skip to the next song.
                        console.log(error);
                        this.shiftQueue(msg.guild.id);
                        this.playQueue(msg);
                    });

                    dispatcher.on('end', () => {
                        // Wait a second.
                        setTimeout(() => {
                            if (this.queueSize(msg.guild.id) > 0) {
                                // Remove the song from the queue.
                                this.shiftQueue(msg.guild.id);
                                // Play the next song in the queue.
                                this.playQueue(msg);
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
    }

    pause(msg) {
        // Get the voice connection.
        const voiceConnection = this.Bot.voiceConnections.find(val => val.channel.guild.id === msg.guild.id);
        if (voiceConnection === null) return msg.channel.send(wrap('Aucune chanson en cours de lecture.'));

        // Pause.
        msg.channel.send(Message.wrap('Lecture en pause.'));
        const dispatcher = voiceConnection.player.dispatcher;
        if (!dispatcher.paused) dispatcher.pause();
    }

    resume(msg) {
        // Get the voice connection.
        const voiceConnection = this.Bot.voiceConnections.find(val => val.channel.guild.id === msg.guild.id);
        if (voiceConnection === null) return msg.channel.send(Message.wrap('Aucune chanson en cours de lecture.'));

        // Resume.
        msg.channel.send(Message.wrap('Lecture reprise.'));
        const dispatcher = voiceConnection.player.dispatcher;
        if (dispatcher.paused) dispatcher.resume();
    }

    stop(msg) {
        // Get the voice connection.
        const voiceConnection = this.Bot.voiceConnections.find(val => val.channel.guild.id === msg.guild.id);
        if (voiceConnection === null) return msg.channel.send(Message.wrap('Aucune chanson en cours de lecture.'));

        // Stop.
        msg.channel.send(Message.wrap('Lecture arrêtée.'));
        this.clearQueue(msg);
        this.deleteServerVolume(msg.guild.id);
        this.deleteServerPlaylist(msg.guild.id);
        const dispatcher = voiceConnection.player.dispatcher;
        dispatcher.end();
        voiceConnection.disconnect();
    }

    next(msg) {
        // Get the voice connection.
        const voiceConnection = this.Bot.voiceConnections.find(val => val.channel.guild.id === msg.guild.id);
        if (voiceConnection === null) return msg.channel.send(Message.wrap('Aucune chanson en cours de lecture.'));

        const dispatcher = voiceConnection.player.dispatcher;
        dispatcher.end();
    }

    volume(msg, volume) {
        // Get the voice connection.
        const voiceConnection = this.Bot.voiceConnections.find(val => val.channel.guild.id === msg.guild.id);
        if (voiceConnection === null) return msg.channel.send(Message.wrap('Aucune chanson en cours de lecture.'));

        let value = this.setServerVolume(msg.guild.id, volume);

        // Get the dispatcher
        const dispatcher = voiceConnection.player.dispatcher;

        dispatcher.setVolume((value/100));
        msg.channel.send(Message.wrap(`Volume défini à ${value}`));
    }
};