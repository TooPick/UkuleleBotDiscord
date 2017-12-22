# Ukulele Bot Discord

## About

Bot made to play Youtube music on a Discord server.
Made with [node.js](https://nodejs.org) and [discord.js](https://github.com/hydrabolt/discord.js).

**Dependencies**
- [axios](https://www.npmjs.com/package/axios)
- [ffmpeg-binaries](https://www.npmjs.com/package/ffmpeg-binaries)
- [opusscript](https://www.npmjs.com/package/opusscript)
- [youtube-search](https://www.npmjs.com/package/youtube-search)
- [ytdl-core](https://www.npmjs.com/package/ytdl-core)

## Installation

#### Install dependencies
    npm install

#### Configuration
- Copy the `config.js.dist` file and rename it to `config.js`.
- Edit the file :
    - `bot_token` : The token of your Discord Bot, provide by https://discordapp.com/developers.
    - `bot_carac` : Caracter use athe the begining of every commands, by default `!` is used.
    - `youtube_api_key` : Your Youtube API key, used to find songs in Youtube, you can get one here https://console.developers.google.com.

## Commands

### Music
##### Play
Search a Youtube song by keywords or url and play it.

    !play <key_words | youtube_link>

##### Pause
Pause the current playing song.

    !pause

##### Resume
Resume the current playing song.

    !resume

##### Next
Play the next song in the queue.

    !next
    
##### Volume
Set the volume to the value passed from 0 to 100.

    !volume <0-100>
        or
    !vol <0-100>

##### Clear
Clear the current queue.

    !clear
    
##### Quit or Stop
Stop the current song or playlist and the bot leave the current voice channel.

    !quit
        or
    !stop
    
##### Help
Display a list of all commands.

    !help

### Playlists
##### Playlist play
Play the playlist passed in params. If it exist in the database.

    !playlist play <playlist_name>

##### Playlist list
List all the playlist available in the server.

    !playlist list