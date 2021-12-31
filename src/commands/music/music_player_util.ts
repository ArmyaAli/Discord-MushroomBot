import { Message } from "discord.js"

export const musicCommandsChecks = (message: Message, args: String[]) => {

    // Are you in a voice Channel
    if (!message?.member?.voice?.channel) {
        message.reply("You must be in a voice channel to use this command.");
        return false;
    }


    return true;
}