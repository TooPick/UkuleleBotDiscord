const options = require('../options');
const youtubeSearch = require('youtube-search');

module.exports.search = function(keywords, maxResults, callback) {
    const opts = {
        maxResults: maxResults,
        key: options.youtube_api_key,
        type: 'video',
    };

    youtubeSearch(keywords, opts, callback);
};