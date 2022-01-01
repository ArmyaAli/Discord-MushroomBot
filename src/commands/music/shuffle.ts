import { SlashCommandBuilder } from '@discordjs/builders';
import { Message } from 'discord.js';
import { Manager as _Manager } from 'erela.js'
import { Manager } from '../../config';
import { musicCommandsChecks } from './music_player_util';

const command = {
    data: new SlashCommandBuilder().setName('shuffle').setDescription("Shuffles the music queue"),
    async run(message: Message, args: String[]) {
        if (!message.guild)
            return;
        if (!musicCommandsChecks(message, args))
            return

        const player = Manager.create({
            guild: message?.guild.id,
            voiceChannel: message?.member?.voice?.channel?.id,
            textChannel: message?.channel?.id,
        });
        
        if (player.queue.length <= 0) {
            message.reply("The Queue is empty.");
            return;
        }

        player.queue.shuffle();
        message.reply(`Queue shuffled.`);
    }
}

export default command;