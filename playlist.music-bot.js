const axios = require('axios');

module.exports.exec = function(msg, suffix, api_url, api_token, callback) {

    const command = suffix.split(' ')[0].trim();
    const params = suffix.substring(command.length).trim();

    switch (command) {
        case 'play': return playPlaylist(command, params);
        case 'list': return listPlaylist(command, params);
    }

    function playPlaylist(command, params) {
        axios.get(api_url + '/playlists/slug/' + params, { headers: { Authorization: api_token } }).then(function (response) {
            msg.channel.send(wrap(`Lecture de la playlist ${response.data.name}`));

            let songs = response.data.songs;
            let randomIndex = Math.floor(Math.random() * (songs.length - 0));
            let playSong = songs[randomIndex];
            callback(playSong);
        }).catch(function (error) {
            console.log(error);
        });
    }

    function listPlaylist(command, params) {
        axios.get(api_url + '/playlists', { headers: { Authorization: api_token } }).then(function (response) {
            let list = "";
            for(let i = 0; i < response.data.length; i++) {
                var playlist = response.data[i];
                list = list + `- ${playlist.name} (${playlist.songs.length}) : ${playlist.slug}\n`;
            }

            msg.channel.send(wrap(list));
        }).catch(function (error) {
            console.log(error);
        });
    }

    /**
     * Wrap the text content for a better display in the text channel.
     */
    function wrap(text) {
        return '```\n' + text.replace(/`/g, '`' + String.fromCharCode(8203)) + '\n```';
    }
}