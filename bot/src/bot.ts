import "dotenv/config"
import Discord, { Intents, Message } from 'discord.js'
import { Manager } from 'erela.js'


const client = new Discord.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES
    ]
});

// Initiate the Manager with some options and listen to some events.
const manager = new Manager({
    // Pass an array of node. Note: You do not need to pass any if you are using the default values (ones shown below).
    nodes: [
        // If you pass a object like so the "host" property is required
        {
            host: "127.0.0.1", // Optional if Lavalink is local
        },
    ],
    // A send method to send data to the Discord WebSocket using your library.
    // Getting the shard for the guild and sending the data to the WebSocket.
    send(id, payload) {
        const guild = client.guilds.cache.get(id);
        if (guild) guild.shard.send(payload);
    },
})

manager.on("nodeConnect", node => console.log(`Node ${node.options.identifier} connected`));
manager.on("nodeError", (node, error) => console.log(`Node ${node.options.identifier} had an error: ${error.message}`))
manager.on("trackStart", (player, track) => {
    if (player.textChannel)
        client.channels.cache
            .get(player.textChannel)
})
manager.on("queueEnd", (player) => {
    if (player.textChannel)
        client.channels.cache
            .get(player.textChannel)

    player.destroy();
});

client.on("raw", (d) => manager.updateVoiceState(d));

client.on('ready', () => {
    console.log("Working");
    // Initiates the manager and connects to all the nodes
    manager.init(client?.user?.id);
    console.log(`Logged in as ${client?.user?.tag}`);
});

// Add the previous code block to this

client.on("messageCreate", async (message: Message) => {
    // Some checks to see if it's a valid message
    if (!message.content.startsWith("=") || !message.guild || message.author.bot) return;
    // Get the command name and arguments
    const [command, ...args] = message.content.slice(1).split(/\s+/g);
    // Check if it's the play command
    if (command === "play") {
        if (!message?.member?.voice?.channel)
            message.reply("you need to join a voice channel.");
        if (!args.length)
            message.reply("you need to give me a URL or a search term.");

        const search = args.join(" ");
        let res;

        try {
            //     // Search for tracks using a query or url, using a query searches youtube automatically and the track requester object
            res = await manager.search(search, message.author);
            //     // Check the load type as this command is not that advanced for basics
            if (res.loadType === "LOAD_FAILED") throw res.exception;
            else if (res.loadType === "PLAYLIST_LOADED") throw { message: "Playlists are not supported with this command." };
        } catch (err) {
            message.reply(`there was an error while searching: ${(err as Error).message}`);
        }

        if (res?.loadType === "NO_MATCHES") message.reply("there was no tracks found with that query.");

        // Create the player 
        const player = manager.create({
            guild: message?.guild.id,
            voiceChannel: message?.member?.voice?.channel?.id,
            textChannel: message?.channel?.id,
        });

        // Connect to the voice channel and add the track to the queue
        player.connect();
        if (res) {
            console.log('res')
            player.queue.add(res.tracks[0]);
        }

        // Checks if the client should play the track if it's the first one added
        if (!player.playing && !player.paused && !player.queue.size) {
            console.log('playing')
            player.play()
        }
        message.reply(`enqueuing ${res?.tracks[0]?.title}.`);
    }
});

client.login(process.env.BOT_TOKEN);