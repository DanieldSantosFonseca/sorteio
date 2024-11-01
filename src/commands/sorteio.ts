import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  GuildMember,
  Client,
} from "discord.js";

export class SorteioCommand {
  static config = new SlashCommandBuilder()
    .setName("sorteio")
    .setDescription(
      "Sorteia as pessoas que estão no mesmo canal de voz que você."
    )
    .addIntegerOption((option) =>
      option
        .setName("quantidade")
        .setDescription("Quantidade de pessoas a serem sorteadas.")
    )
    .toJSON();

  static async exec(interaction: ChatInputCommandInteraction, client: Client) {
    const quantidade = interaction.options.getInteger("quantidade") ?? 1;

    console.log({ interaction });

    if (quantidade < 1) {
      return interaction.reply({
        content:
          "A quantidade de pessoas a serem sorteadas deve ser maior que 0.",
        ephemeral: true,
      });
    }

    const guild = interaction.guild;
    if (!guild) {
      return interaction.reply({
        content: "Erro ao obter o servidor.",
        ephemeral: true,
      });
    }

    const member = guild.members.cache.get(interaction.user.id);

    if (!member || !(member instanceof GuildMember)) {
      return interaction.reply({
        content: "Não foi possível obter as informações do membro.",
        ephemeral: true,
      });
    }

    console.log({ permission: process.env.ROLE_PERMISSION });
    console.log(member.roles.cache.has(process.env.ROLE_PERMISSION!));

    if (!member.roles.cache.has(process.env.ROLE_PERMISSION!)) {
      return interaction.reply({
        content: "Você não tem permissão para usar este comando.",
        ephemeral: false,
      });
    }

    const voiceChannel = member.voice.channel;
    if (!voiceChannel) {
      return interaction.reply({
        content:
          "Você precisa estar em um canal de voz para usar este comando.",
        ephemeral: true,
      });
    }

    const members = voiceChannel.members.filter((member) => !member.user.bot);

    if (members.size < quantidade) {
      return interaction.reply({
        content: "Não há pessoas suficientes no canal de voz para sortear.",
        ephemeral: false,
      });
    }

    const winners = members
      .random(quantidade)
      .map((member) => member.user.toString());

    const content = winners
      .map((winner) => `**Parabéns, ${winner}** 🎉🎊`)
      .join("\n");

    interaction.reply({
      content,
      ephemeral: false,
    });
  }
}
