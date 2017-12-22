module.exports.wrap = function(text) {
    return '```\n' + text.replace(/`/g, '`' + String.fromCharCode(8203)) + '\n```';
};