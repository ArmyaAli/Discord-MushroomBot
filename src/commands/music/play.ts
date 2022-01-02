import { SlashCommandBuilder } from '@discordjs/builders';
import { Message } from 'discord.js';
import { Manager } from '../../config';
import { musicCommandsChecks, populateQueue } from './music_player_util';

const command = {
    data: new SlashCommandBuilder().setName('play').setDescription("This will play a song"),
    async run(message: Message, args: String[]) {
        if (!message.guild)
            return;
        if (!musicCommandsChecks(message, args))
            return
        // Is there a search term
        if (!args.length && message) {
            message.reply("You must give me a URL or a search term.");
            return false;
        }
        const query = args.join(" ");

        try {
            let res = await Manager.search(query, message.author);

            switch (res.loadType) {
                case "LOAD_FAILED":
                    throw res.exception;
                case "NO_MATCHES":
                    message.reply("there was no tracks found with that query.");
                    return
                case "PLAYLIST_LOADED": // Create the player 
                    const player = Manager.create({
                        guild: message?.guild.id,
                        voiceChannel: message?.member?.voice?.channel?.id,
                        textChannel: message?.channel?.id,
                    });
                    const track = res.tracks[0];

                    if (track) {
                        if (!player.playing && !player.paused && !player.queue.size) {
                            player.connect();
                            player.play(track);
                            await message.reply(`Now playing ${track.title}.`);
                        }
                        populateQueue(message, player, res.tracks);
                    }
                    return;
            }

            // Create the player 
            const player = Manager.create({
                guild: message?.guild.id,
                voiceChannel: message?.member?.voice?.channel?.id,
                textChannel: message?.channel?.id,
            });

            // Connect to the voice channel and add the track to the queue
            player.connect();

            if (res) {
                player.queue.add(res.tracks[0]);
            }

            // Checks if the client should play the track if it's the first one added
            if (!player.playing && !player.paused && !player.queue.size) {
                player.play()
                message.reply(`Now playing ${res?.tracks[0]?.title}.`);
                return
            }

            message.reply(`Adding ${res?.tracks[0]?.title} to the Queue.`);
        } catch (err) {
            message.reply(`there was an error while searching: ${(err as Error).message}`);
        }
    }
}

export default command;