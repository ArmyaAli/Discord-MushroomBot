import { SlashCommandBuilder } from '@discordjs/builders';
import { Message } from 'discord.js';
import { Manager as _Manager } from 'erela.js'
import { musicCommandsChecks } from './music_player_util';

const command = {
    data: new SlashCommandBuilder().setName('queue').setDescription("This will return the the top 10 songs in the music Queue"),
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

        if(player.queue.length <= 0) {
            message.reply("The Queue is empty.");
            return;
        }

        let result = "";
        for(let i = 0; i < player.queue.length && i < 10; ++i)
        {
            result += `${i+1}. ${player.queue[i].title}. Requester: ${player.queue[i]?.requester}\n`;
            console.log(player.queue[i]);
        }
        message.reply(result);
    }
}

export default command;