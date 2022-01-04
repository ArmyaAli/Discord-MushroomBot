import { SlashCommandBuilder } from '@discordjs/builders';
import { Message } from 'discord.js';
import { Manager as _Manager } from 'erela.js'
import { Manager } from '../../config';

const command = {
    data: new SlashCommandBuilder().setName('skip').setDescription("This will skip the current song. Pass in a number to skip that number of songs!"),
    async run(message: Message, args: string[]) {
        if (!message.guild)
            return;
        // Are you in a voice Channel
        if (!message?.member?.voice?.channel) {
            message.reply("You must be in a voice channel to use this command.");
            return false;
        }
        if (args.length > 0 && !/\d+/.test(args[0])) {
            message.reply("Skip command can only take a number argument!");
            return
        }

        const player = Manager.create({
            guild: message?.guild.id,
            voiceChannel: message?.member?.voice?.channel?.id,
            textChannel: message?.channel?.id,
        });

        const songsToSkip = args[0] === undefined ? 0 : parseInt(args[0]);

        if (songsToSkip > player.queue.length) {
            message.reply("You cannot skip more songs than the Queue holds!");
            return;
        }

        if (player.queue.length <= 0) {
            message.reply("The Queue is empty.");
            return;
        }

        player.stop(songsToSkip)
    }
}

export default command;