import { Message } from "discord.js";

export function isPermittedToControl(c1: Message, d2: Message) {
  if(c1.member?.voice.channelID !== d2.member?.voice.channelID) {
    return false;
  } return true;
}