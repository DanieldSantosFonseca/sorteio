import 'dotenv/config';
import { REST, Routes } from 'discord.js';
import { Raffle } from './commands/raffle';
import { getOrThrow } from './utils';

const token = getOrThrow('TOKEN');
const applicationId = getOrThrow('APPLICATION_ID');

const rest = new REST().setToken(token);

export const deployCommands = async () => {
  try {
    await rest.put(Routes.applicationCommands(applicationId), {
      body: [Raffle.config],
    });
  } catch (error) {
    console.error(error);
  }
};
