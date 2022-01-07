import { TextChannel, VoiceState } from "discord.js";
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
    c?.run(message, args);
});

Client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
    const { commandName } = interaction;
    const c = (await Commands)?.get(commandName)
});

Client.on('voiceStateUpdate', async (oldState, newState) => {
    // if (currentSize === 1) {
    //     if (me) {
    //         const textChannel = player?.options?.textChannel;
    //         if (textChannel) {
    //             const channel = guild.channels.cache.get(textChannel) as TextChannel;
    //             channel.send("Thanks for using Mushroom Bot! Leaving the channel in 30 seconds!");
    //         }
    //         setTimeout(() => {
    //             const member = oldState.channel?.members.get(me)
    //             member?.voice?.disconnect();
    //         }, 3000);
    //     }

    // }
});

Client.login(BOT_TOKEN);