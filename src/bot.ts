import { Client, Manager, Commands, BOT_TOKEN, BOT_PREFIX } from "./config";

Client.on("raw", (d) => {
    Manager.updateVoiceState(d)
});

Client.on('ready', () => {
    Manager.init(Client?.user?.id);
    console.log(`Logged in as ${Client?.user?.tag}`);
});

Client.on("messageCreate", async message => {
    if (!message.content.startsWith(BOT_PREFIX) || !message.guild || message.author.bot) return;
    const [command, ...args] = message.content.slice(1).split(/\s+/g);
    const c = (await Commands)?.get(command)
    if (c)
        c.run(message, args);
});

Client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;
    const c = (await Commands)?.get(commandName)
});


Client.login(BOT_TOKEN);