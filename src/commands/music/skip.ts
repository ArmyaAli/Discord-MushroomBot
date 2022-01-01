import { SlashCommandBuilder } from '@discordjs/builders';
import { Message } from 'discord.js';
import { Manager as _Manager } from 'erela.js'
import { Manager } from '../../config';

const command = {
    data: new SlashCommandBuilder().setName('skip').setDescription("This will skip the current song"),
    async run(message: Message, args: String[]) {
        if (!message.guild)
            return;
        // Are you in a voice Channel
        if (!message?.member?.voice?.channel) {
            message.reply("You must be in a voice channel to use this command.");
            return false;
        }

        const player = Manager.create({
            guild: message?.guild.id,
            voiceChannel: message?.member?.voice?.channel?.id,
            textChannel: message?.channel?.id,
        });

        if (player.queue.length <= 0) {
            message.reply("The Queue is empty.");
            return;
        }
        message.reply(`Skipping: Now playing ${player?.stop()?.queue[0]?.title}`);
    }
}

export default command;