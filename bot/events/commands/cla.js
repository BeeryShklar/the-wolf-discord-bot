const Discord = require('discord.js')
const { GuildSettings } = require('../../settings')
const { protectAdmin } = require('../../helpers/protect')

/**
 * @param {Array[String]} args
 * @param {String} cmd
 * @param {Discord.Message} msg
 */
const cb = async (args, cmd, msg) => {
	if (!(await protectAdmin(msg.member, msg.guild.id))) {
		return msg.channel.send(
			new Discord.MessageEmbed().setTitle(
				"You don't have permissions to use this commands"
			)
		)
	}

	const guildSettings = new GuildSettings(msg.guild.id)
	const prefix = await guildSettings.get('prefix')
	const msgColor = await guildSettings.get('msg-color')
	const warningColor = await guildSettings.get('warning-color')

	try {
		const allMessages = await msg.channel.messages.fetch()
		if (allMessages.length > 100 && args[0] !== 'f')
			msg.channel.send(
				new Discord.MessageEmbed()
					.setColor(msgColor)
					.setTitle('Too many messages')
					.setDescription(
						`Type \`${prefix}cla\` f to force deleting all the messages.`
					)
			)

		const messagesDeleted = await msg.channel.bulkDelete(allMessages, true)
		const sentMessage = await msg.channel.send(
			new Discord.MessageEmbed()
				.setColor(msgColor)
				.setTitle(`Deleted ${messagesDeleted.size} messages`)
		)
		setTimeout(() => sentMessage.delete(), 2000)
	} catch (err) {
		msg.channel.send(
			new Discord.MessageEmbed()
				.setColor(warningColor)
				.setTitle(`An error occurred while trying to delete this messages :(`)
		)
	}
}

const help = () => ({
	command: 'cla',
	description: 'Clears all messages in channel.',
})

module.exports = {
	cb,
	help,
}
