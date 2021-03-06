import "dotenv/config";
import { SlashCommandBuilder } from '@discordjs/builders';
import Discord, { Collection, Intents, Interaction, Message } from 'discord.js'
import { Manager as _Manager } from 'erela.js'
import { readFileTree } from './util';
import Spotify from 'erela.js-spotify';

interface botCommand {
    data: SlashCommandBuilder,
    run: (message: Message, args: string[]) => void;
    // run: (interaction: Interaction, args: String[]) => void;
}

const clientID = process.env.SPOTIFY_CLIENT_ID || ""; // clientID from your Spotify app
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET || ""; // clientSecret from your Spotify app

export const BOT_TOKEN = process.env.BOT_TOKEN;
export const BOT_PREFIX = "!";
export const Client = new Discord.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES
    ]
});

export const Manager = new _Manager({
    plugins: [
        new Spotify({
            clientID,
            clientSecret
        })
    ],
    send(id, payload) {
        const guild = Client.guilds.cache.get(id);
        if (guild) guild.shard.send(payload);
    },
});


export const Commands = (async () => {
    const commands = new Collection<string, botCommand>();
    let commandFiles: string[] = []

    try {
        await readFileTree(commandFiles, "");
        commandFiles = commandFiles.filter((path) => path.endsWith(".js") || path.endsWith(".ts"));
        for (const filePath of commandFiles) {
            const command = await import(filePath);
            const name = command?.default?.data?.name;
            const commandBody = command?.default;

            if (name && commandBody) {
                await commands.set(name, commandBody);
            }
        }
        return commands;
    } catch (error) {
        console.error(error);
    }
})();

export const Guilds = (async () => {
    // console.log(await Client.guilds.fetch());
})();

