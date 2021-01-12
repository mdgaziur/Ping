import { Player } from 'discord-player';
import { Message, Client } from 'discord.js';

export async function resumeFunction(
  command: Message,
  player: Player
) {
  let url = command.content.split(" ")[1];
  if(!url) {
    command.channel.send("You forgot to give me the url of the audio 😞");
  } else {
    player.resume(command);
  }
}