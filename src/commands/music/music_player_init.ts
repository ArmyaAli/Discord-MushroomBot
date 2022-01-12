import { Message, MessageActionRow, MessageButton, TextChannel } from "discord.js";
import { Manager, Client, Commands } from "../../config";

Manager.on("nodeConnect", node => console.log(`Node ${node.options.identifier} connected`));
Manager.on("nodeDisconnect", node => console.log(`Node disconnect`));
Manager.on("playerMove", (player, oldChannel, newChannel) => {
    if(newChannel === null) 
        player.destroy();
});

Manager.on("nodeError", (node, error) => console.log(`Node ${node.options.identifier} had an error: ${error.message}`))

Manager.on("trackStart", (player, track) => {
    const { guild, textChannel } = player['options'];
    const guildContext = Client.guilds.cache.get(guild);
    if (guildContext) {
        const textChannelContext = guildContext.channels.cache.get(textChannel) as TextChannel;
        if (textChannelContext) {
            textChannelContext.send(`Now playing: ${track.title} - ${track.author}. Requested by ${track?.requester}`);
        }
    }
})

Manager.on("trackError", (player, track) => {

})

Manager.on("queueEnd", (player) => {

});
