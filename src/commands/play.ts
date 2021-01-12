import { Player } from "discord-player";
import { Message, MessageReaction } from "discord.js";

export async function playFunction(command: Message, player: Player) {
  if (!command.member?.voice.channel) {
    command.channel.send("You need to join a channel before playing!");
    return;
  }
  let url = command.content.split(" ")[1];
  let isPlaying = true;
  if (!url) {
    command.channel.send("You forgot to give me the url of the audio 😞");
  } else {
    await player.play(command, url);
    let message = await command.channel.send(`
Now playing **${
      player.nowPlaying(command).title
    }**. Click on the reactions to control the player :^)
Url to song: ${player.nowPlaying(command).url}
`);
    await message.react("⏯");
    await message.react("⏭");
    await message.react("⏹");

    player.on("trackStart", async () => {
      await message.edit(`
Now playing **${
        player.nowPlaying(command).title
      }**. Click on the reactions to control the player :^)
Url to song: ${player.nowPlaying(command).url}
      `);
    });

    let reactionCollector = message.createReactionCollector(
      (reaction, user) => user.id !== message.client.user?.id,
      {
        time: player.nowPlaying(message).durationMS,
      }
    );

    function handleReaction(reaction: MessageReaction) {
      switch (reaction.emoji.name) {
        case "⏯":
          if (isPlaying) {
            player.pause(message);
            isPlaying = false;
          } else {
            player.resume(message);
            isPlaying = true;
          }
          break;
        case "⏭":
          player.skip(message);
          break;
        case "⏹":
          player.stop(message);
          message.channel.send("❌ Stopped playing");
          message.delete();
          player.removeAllListeners();
          break;
      }
    }

    reactionCollector.on("collect", (reaction) => {
      handleReaction(reaction);
    });
    
    reactionCollector.on("remove", (reaction) => {
      handleReaction(reaction);
    });
  }
}
