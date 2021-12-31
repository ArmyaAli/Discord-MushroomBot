import { SlashCommandBuilder } from '@discordjs/builders';
import Discord, { Collection, Intents, Message } from 'discord.js'
import { Manager as _Manager } from 'erela.js'
import { readCommandsRecursive } from './util';

interface botCommand {
    data: SlashCommandBuilder,
    run: (message: Message, Manager: _Manager, args: String[]) => void;
}

export const Client = new Discord.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES
    ]
});

export const Manager = new _Manager({
    nodes: [
        {
            host: "127.0.0.1", // Optional if Lavalink is local
        },
    ],
    send(id, payload) {
        const guild = Client.guilds.cache.get(id);
        if (guild) guild.shard.send(payload);
    },
});


export const Commands = (async () => {
    const commandPath = "./src/commands/";
    const commands = new Collection<string, botCommand>();
    
    let commandFiles: string[] = [];
    try {
        readCommandsRecursive(commandPath, commandFiles);
        commandFiles = commandFiles.filter(file => file.endsWith('.ts') || file.endsWith('.js'));

        for (const filePath of commandFiles) {
            const command = await import(filePath.replace("src\\", ".\\"));
            await commands.set(command?.default?.data?.name, command?.default);
        }
        
        return commands;
    } catch (error) {
        console.error(error);
    }
})();

export const Guilds = (async () => {
    console.log(await Client.guilds.fetch());
})();

