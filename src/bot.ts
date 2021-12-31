import "dotenv/config"
import { Message } from 'discord.js'
import { Client, Manager, Commands } from "./config";

Client.on("raw", (d) => Manager.updateVoiceState(d));

Client.on('ready', () => {
    Manager.init(Client?.user?.id);
    console.log(`Logged in as ${Client?.user?.tag}`);
});

Client.on("messageCreate", async (message: Message) => {
    if (!message.content.startsWith("=") || !message.guild || message.author.bot) return;
    const [command, ...args] = message.content.slice(1).split(/\s+/g);
    const c = (await Commands)?.get(command)
    if (c)
        c.run(message, Manager, args);
});

Client.login(process.env.BOT_TOKEN);