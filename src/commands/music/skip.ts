import { SlashCommandBuilder } from '@discordjs/builders';
import { Message } from 'discord.js';
import { Manager as _Manager } from 'erela.js'
import { musicCommandsChecks } from './music_player_util';

const command = {
    data: new SlashCommandBuilder().setName('skip').setDescription("This will skip the current song"),
    async run(message: Message, Manager: _Manager, args: String[]) {
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

        player.stop();
        message.reply(`Skipping: Now playing ${player?.queue?.current?.title}`);
    }
}

export default command;