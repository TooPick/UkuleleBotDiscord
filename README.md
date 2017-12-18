# Ukulele Bot Discord

## About

Bot made to play Youtube music on a Discord server.
Made with [node.js](https://nodejs.org) and [discord.js](https://github.com/hydrabolt/discord.js).

**Dependencies**
- [ffmpeg-binaries](https://www.npmjs.com/package/ffmpeg-binaries)
- [opusscript](https://www.npmjs.com/package/opusscript)
- [youtube-search](https://www.npmjs.com/package/youtube-search)
- [ytdl-core](https://www.npmjs.com/package/ytdl-core)

## Installation

#### Install dependencies
    npm install

#### Configuration
Edit the `config.js` file :
- `bot_token` : The token of your Discord Bot, provide by https://discordapp.com/developers.
- `bot_carac` : Caracter use athe the begining of every commands, by default `!` is used.
- `youtube_api_key` : Your Youtube API key, used to find songs in Youtube, you can get one here https://console.developers.google.com.

## Commands

### Play
Search a song in Youtube with de provides key words or Youtube link, if a song is already playing, add the song to queue.

    !play <key_words | youtube_link>

### Pause
Pause the current song.

    !pause

### Resume
Resume the current song.

    !resume

### Next
Play the next song in the queue.

    !next
    
### Volume
Set the music volume, beetween 0 and 100.

    !volume <0-100>

### Clear
Clear the current queue.

    !clear
    
### Quit
Stop the current song and the bot leave the current voice channel.

    !quit <0-100>
    
### Help
Display a list of all commands.

    !help