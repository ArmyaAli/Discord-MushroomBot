import { SlashCommandBuilder } from '@discordjs/builders';

const command = {
    data: new SlashCommandBuilder().setName('ali').setDescription("This is a test command"),
}

export default command;