const axios = require('axios');
const YoutubeSearch = require('./YoutubeSearch');

module.exports = class BotApiManager {
    constructor(username, password, api_url) {
        this.username = username;
        this.password = password;
        this.api_url = api_url;
    }

    getConnection(callback) {
        axios.post(this.api_url + '/login', {
            username: this.username,
            password: this.password,
        }).then(function (response) {
            if(response && response.data && response.data.token) {
                callback(null, response.data.token);
            } else {
                callback("API connection error.");
            }
        }).catch(function (err) {
            callback(err);
        });
    }

    getPlaylistBySlug(slug, callback) {
        let api_url = this.api_url;
        this.getConnection(function(err, token) {
            if(err)
                return callback(err);

            axios.get(api_url + '/playlists/slug/' + slug, { headers: { Authorization: token } }).then(function (response) {
                if(response && response.data)
                    callback(null, response.data);
                else
                    callback("No song found.");
            }).catch(function (err) {
                callback(err);
            });
        });
    }

    getRandomSongInPlaylist(slug, callback) {
        this.getPlaylistBySlug(slug, function(err, playlist) {
            if(err)
                return callback(err);

            if(playlist && playlist.songs && (playlist.songs.length > 0)) {
                let randomIndex = Math.floor(Math.random() * (playlist.songs.length - 0));
                YoutubeSearch.search(playlist.songs[randomIndex].url, 1, function(err, results) {
                    if(err)
                        return callback(err);

                    if(results.length <= 0)
                        return callback("No song found.");
                    else
                        callback(null, results[0]);
                });
            } else {
                callback(err);
            }
        });
    }

    getAllPlaylist(callback) {
        let api_url = this.api_url;
        this.getConnection(function(err, token) {
            if(err)
                return callback(err);

            axios.get(api_url + '/playlists', { headers: { Authorization: token } }).then(function (response) {
                if(response && response.data)
                    callback(null, response.data);
                else
                    callback("No playlist found.");
            }).catch(function (err) {
                callback(err);
            });
        });
    }
};