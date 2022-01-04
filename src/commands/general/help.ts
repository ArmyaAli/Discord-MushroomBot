import { SlashCommandBuilder } from '@discordjs/builders';
import { Message } from 'discord.js';
import { Commands } from '../../config';

const command = {
    data: new SlashCommandBuilder().setName('help').setDescription("Gets a list of all the commands I can use."),
    async run(message: Message, args: String[]) {
        if (!message.guild)
            return;

        const _commands = await Commands;
        let msg = `There are total of ${_commands?.size} commands.\`\`\`\n`;
        if (_commands) {
            for (const [name, body] of _commands) {
                msg += `!${name} - ${body.data.description}\n`;
            }
        }
        msg+='\`\`\`';
        message.reply(msg);
    }
}

export default command;