import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  GuildMember,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
} from 'discord.js';
import { getOrThrow } from '../utils';

interface RaffleOptions {
  roleId: string;
  historyChannelId: string;
}

class RaffleCommand {
  private constructor(private readonly options: RaffleOptions) {}

  static create(): RaffleCommand {
    return new RaffleCommand({
      roleId: getOrThrow('ROLE_PERMISSION'),
      historyChannelId: getOrThrow('RAFFLE_HISTORY_CHANNEL_ID'),
    });
  }

  get config(): RESTPostAPIChatInputApplicationCommandsJSONBody {
    return new SlashCommandBuilder()
      .setName('raffle')
      .setNameLocalization('pt-BR', 'sorteio')
      .setDescription(
        'Selects people from your current voice channel for a raffle.',
      )
      .setDescriptionLocalization(
        'pt-BR',
        'Sorteia as pessoas que estão no mesmo canal de voz que você.',
      )
      .addIntegerOption((option) =>
        option
          .setName('quantity')
          .setDescription('Number of people to select in the raffle.')
          .setNameLocalization('pt-BR', 'quantidade')
          .setDescriptionLocalization(
            'pt-BR',
            'Quantidade de pessoas a serem sorteadas.',
          ),
      )
      .addStringOption((option) =>
        option
          .setName('award')
          .setDescription('Prize to be awarded.')
          .setNameLocalization('pt-BR', 'premiação')
          .setDescriptionLocalization('pt-BR', 'Prêmio a ser sorteado.'),
      )
      .toJSON();
  }

  async exec(interaction: ChatInputCommandInteraction) {
    const quantity = interaction.options.getInteger('quantity') ?? 1;

    if (quantity < 1) {
      return interaction.reply({
        content:
          'A quantidade de pessoas a serem sorteadas deve ser maior que 0.',

        ephemeral: true,
      });
    }

    const guild = interaction.guild;
    if (!guild) {
      return interaction.reply({
        content: 'Erro ao obter o servidor.',
        ephemeral: true,
      });
    }

    const member = guild.members.cache.get(interaction.user.id);

    if (!member || !(member instanceof GuildMember)) {
      return interaction.reply({
        content: 'Não foi possível obter as informações do membro.',
        ephemeral: true,
      });
    }

    console.log({ permission: this.options });
    console.log(member.roles.cache.has(this.options.roleId));

    if (!member.roles.cache.has(this.options.roleId)) {
      return interaction.reply({
        content: 'Você não tem permissão para usar este comando.',
        ephemeral: false,
      });
    }

    const voiceChannel = member.voice.channel;
    if (!voiceChannel) {
      return interaction.reply({
        content:
          'Você precisa estar em um canal de voz para usar este comando.',
        ephemeral: true,
      });
    }

    const members = voiceChannel.members.filter((member) => !member.user.bot);

    if (members.size < quantity) {
      return interaction.reply({
        content: 'Não há pessoas suficientes no canal de voz para sortear.',
        ephemeral: true,
      });
    }

    const winners = members
      .random(quantity)
      .map((member) => member.user.toString());

    const award = interaction.options.getString('award');

    const content = winners
      .map((winner) => `**Parabéns, ${winner}** ${award} 🎉🎊`)
      .join('\n');

    interaction.reply({
      content,
      ephemeral: true,
    });
  }
}

export const Raffle = RaffleCommand.create();
