import { Message } from "discord.js"
import { Player, Track } from "erela.js";

export const musicCommandsChecks = (message: Message, args: String[]) => {
    // Are you in a voice Channel
    if (!message?.member?.voice?.channel) {
        message.reply("You must be in a voice channel to use this command.");
        return false;
    }
    return true;
}


export const populateQueue = async (message: Message, player: Player, tracks: Track[]) => {
    const msg = await message.reply(`Adding ${tracks.length - 1} to the Queue! You will be notified when completed.`);

    for (let i = 1; i < tracks.length; ++i)
        player.queue.add(tracks[i]);

    msg.edit(`Finished adding all ${tracks.length - 1} to the Queue!`);
}
