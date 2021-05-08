import { ApplicationCommandOptionData } from "discord.js";
import { InteractionCommand } from "../core/interactions/interactionCommand";

export class TestInteraction extends InteractionCommand {
  name = "main";
  description = "test";
  options: ApplicationCommandOptionData[] = [{ name: "add", type: "SUB_COMMAND", description: "test" }];
  async execute(): Promise<void> {}
}
