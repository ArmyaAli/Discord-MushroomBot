import { TextChannel, VoiceState } from "discord.js";
import { Client, Manager, Commands, BOT_TOKEN, BOT_PREFIX } from "./config";

Client.on("raw", (d) => {
    Manager.updateVoiceState(d)
});

Client.on('ready', () => {
    try {
        Manager.init(Client?.user?.id);

    } catch(error) {
        console.log(error);
    }
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
    // if nobody left the channel in question, return.
    if (oldState.channelId !== oldState?.guild?.me?.voice.channelId || newState.channel)
        return;

    const size = oldState?.channel?.members?.size;
    const guild = oldState?.guild?.id;
    if (size) {
        if (!(size - 1)) {
            const player = Manager.players.get(guild);
            const textChannelId = player?.textChannel;
            if (textChannelId) {
                const textChannel = oldState?.guild.channels.cache.get(textChannelId) as TextChannel;
                textChannel.send("Empty voice channel! Mushroom Bot leaving in 30 seconds~ (if still empty)!")

                setTimeout(() => {
                    const s = oldState?.channel?.members?.size;
                    if (s) {
                        if (!(s - 1)) {
                            textChannel.send("Leaving now!~")
                            oldState?.guild?.me?.voice.disconnect("Empty voice channel");
                        }
                    }
                }, 30000);
            }
        }
    }
});

Client.login(BOT_TOKEN).catch(error => console.log)