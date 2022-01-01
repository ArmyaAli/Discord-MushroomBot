import { SlashCommandBuilder } from '@discordjs/builders';
import { Manager as _Manager } from 'erela.js'
import { Message } from 'discord.js';
import { Manager } from '../../config';

const command = {
    data: new SlashCommandBuilder().setName('resume').setDescription("This will resume the current track"),
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

        player.pause(false);
        message.reply(`Music player resumed on track ${player?.queue?.current?.title}`);
    }
}

export default command;