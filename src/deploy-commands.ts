import "dotenv/config";
import { REST, Routes } from "discord.js";
import { SorteioCommand } from "./commands/sorteio";

const { TOKEN, APPLICATION_ID } = process.env as Record<string, string>;

const rest = new REST({ version: "10" }).setToken(TOKEN);

export const deployCommands = async () => {
  try {
    await rest.put(Routes.applicationCommands(APPLICATION_ID), {
      body: [SorteioCommand.config],
    });
  } catch (error) {
    console.error(error);
  }
};
