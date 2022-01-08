import { SlashCommandBuilder } from '@discordjs/builders';
import { Interaction, Message } from 'discord.js';
import { Manager } from '../../config';
import { musicCommandsChecks, populateQueue } from './music_player_util';

const command = {
    data: new SlashCommandBuilder().setName('playnow').setDescription("This will play a song and skip the current song"),
    async run(message: Message, args: string[]) {
        if (!message.guild)
            return;
        if (!musicCommandsChecks(message, args))
            return
        // Is there a search term
        if (!args.length && message) {
            message.reply("You must give me a URL or a search term.");
            return false;
        }
        let query = args.join(" ").split('&')[0];
        try {
            let res = await Manager.search(query, message.author);

            switch (res.loadType) {
                case "LOAD_FAILED":
                    throw res.exception;
                case "NO_MATCHES":
                    message.reply("there was no tracks found with that query.");
                    return
                case "PLAYLIST_LOADED": // Create the player 
                    message.reply("playnow command does not support playlists! Use play command.")
                    return;
            }
            // Create the player 
            const player = Manager.create({
                guild: message?.guild.id,
                voiceChannel: message?.member?.voice?.channel?.id,
                textChannel: message?.channel?.id,
            });
            player.connect();
            player.play(res.tracks[0]);
        } catch (err) {
            message.reply(`There was an error while searching: ${(err as Error).message}`);
        }
    }
}

export default command;