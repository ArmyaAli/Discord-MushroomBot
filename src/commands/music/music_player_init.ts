import { Manager, Client } from "../../config";

Manager.on("nodeConnect", node => console.log(`Node ${node.options.identifier} connected`));

Manager.on("nodeError", (node, error) => console.log(`Node ${node.options.identifier} had an error: ${error.message}`))

Manager.on("trackStart", (player, track) => {
    if (player.textChannel)
        Client.channels.cache
            .get(player.textChannel)
})

Manager.on("queueEnd", (player) => {
    if (player.textChannel)
        Client.channels.cache
            .get(player.textChannel)

    player.destroy();
});