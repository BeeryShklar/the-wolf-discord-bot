const Discord = require('discord.js')
const { GuildSettings } = require('../../settings')
const { protectAdmin } = require('../../helpers/protect')

/**
 * @param {Array[String]} args
 * @param {String} cmd
 * @param {Discord.Message} msg
 */
const cb = async (args, _, msg) => {
	if (!(await protectAdmin(msg.member, msg.guild.id))) {
		return msg.channel.send(
			new Discord.MessageEmbed().setTitle(
				"You don't have permissions to use this commands"
			)
		)
	}

	const guildSettings = new GuildSettings(msg.guild.id)
	const msgColor = await guildSettings.get('msg-color')
	const warningColor = await guildSettings.get('warning-color')

	try {
		const amountToDelete = parseInt(args[0])
		const messagesToDelete = await msg.channel.messages.fetch({
			limit: amountToDelete < 100 ? amountToDelete + 1 : 100,
		})

		const messagesDeleted = await msg.channel.bulkDelete(messagesToDelete)

		if (amountToDelete > 100) {
			const warningMessage = await msg.channel.send(
				new Discord.MessageEmbed()
					.setColor(warningColor)
					.setTitle(`Can't delete more than 100 messages at once`)
			)
			setTimeout(() => warningMessage.delete(), 2000)
		}
		const sentMessage = await msg.channel.send(
			new Discord.MessageEmbed()
				.setColor(msgColor)
				.setTitle(`Deleted ${messagesDeleted.size - 1} messages`)
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
	command: 'c [amount]',
	description: 'Clear `x` amount messages.',
})

module.exports = {
	cb,
	help,
}
