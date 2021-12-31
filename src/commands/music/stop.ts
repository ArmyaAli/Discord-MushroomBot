import { SlashCommandBuilder } from '@discordjs/builders';
import { Message } from 'discord.js';
import { Manager as _Manager } from 'erela.js'
import { musicCommandsChecks } from './music_player_util';

const command = {
    data: new SlashCommandBuilder().setName('stop').setDescription("This will stop the music player"),
    async run(message: Message, Manager: _Manager, args: String[]) {
        if (!message.guild)
            return;
        if (!musicCommandsChecks(message, args))
            return
        
        const player = Manager.create({
            guild: message?.guild.id,
            voiceChannel: message?.member?.voice?.channel?.id,
            textChannel: message?.channel?.id,
        });

        player.destroy();
        message.reply(`Stopping! Thanks for using Mushroom Bot!`);
    }
}

export default command;