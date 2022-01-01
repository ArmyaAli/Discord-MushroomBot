import { SlashCommandBuilder } from '@discordjs/builders';
import { Message } from 'discord.js';

const command = {
    data: new SlashCommandBuilder().setName('help').setDescription("Gets a list of all the commands I can use."),
    async run(message: Message, args: String[]) {
        if (!message.guild)
            return;

        let msg = ``;

        

        message.reply(msg);
    }
}

export default command;