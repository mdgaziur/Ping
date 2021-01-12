import express, { Response } from 'express';
import { config } from 'dotenv';
import * as Discord from 'discord.js';
import { playFunction } from './commands/play';
import { Player } from 'discord-player'; 

// load discord token from .env file
config();

(async () => {
  if(!process.env.PING_DISCORD_TOKEN) {
    throw new Error("Discord token is not set!");
  }

  let app = express();
  app.get("/", (req, res: Response) => {
    res.redirect("https://discord.com/api/oauth2/authorize?client_id=798462656935755776&permissions=36710400&scope=bot");
  });
  app.listen(8080);

  let bot = new Discord.Client();
  let musicPlayer = new Player(bot);

  bot.on('message', (message: Discord.Message) => {
    if(message.content === "ping") {
      message.channel.send("Pong!");
    } else if(message.content.startsWith("!play ")) {
      playFunction(message, musicPlayer);
    }
  });

  bot.login(process.env.PING_DISCORD_TOKEN);

  console.log("I'm up and running! 🙂")
})();