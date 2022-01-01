import { SlashCommandBuilder } from '@discordjs/builders';
import { Message } from 'discord.js';
import { Manager as _Manager } from 'erela.js'
import { Manager } from '../../config';
import { musicCommandsChecks } from './music_player_util';

const command = {
    data: new SlashCommandBuilder().setName('song').setDescription("Gives the user the current song player"),
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

        if(!player.playing) {
            message.reply("I am not playing a song at the moment!");
            return;
        }

        message.reply(`Current Song: ${player?.queue?.current?.title}`);


    }
}

export default command;