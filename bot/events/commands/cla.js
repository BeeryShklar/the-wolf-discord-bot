const Discord = require('discord.js')
const { GuildSettings } = require('../../settings')

/**
 * @param {Array[String]} args
 * @param {String} cmd
 * @param {Discord.Message} msg
 */
const cb = async (args, cmd, msg) => {
	const guildSettings = new GuildSettings(msg.guild.id)
	const prefix = await guildSettings.get('prefix')
	const msgColor = await guildSettings.get('msg-color')

	const allMessages = await await msg.channel.messages.fetch()
	if (allMessages.length > 100 && args[0] !== 'f')
		msg.channel.send(
			new Discord.MessageEmbed()
				.setColor(msgColor)
				.setTitle('Too many messages')
				.setDescription(
					`Type \`${prefix}cleara\` f to force deleting all the messages.`
				)
		)

	const messagesDeleted = await msg.channel.bulkDelete(allMessages)
	const sentMessage = await msg.channel.send(
		new Discord.MessageEmbed()
			.setColor(msgColor)
			.setTitle(`Deleted ${messagesDeleted.size} messages`)
	)
	setTimeout(() => sentMessage.delete(), 2000)
}

const help = () => ({
	command: 'cla',
	description: 'Clears all messages in channel.',
})

module.exports = {
	cb,
	help,
}
