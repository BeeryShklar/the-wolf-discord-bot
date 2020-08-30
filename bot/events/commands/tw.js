const Discord = require('discord.js')
const { GuildSettings, defaultSettings } = require('../../settings')
const settings = require('../../settings')

/**
 * @param {Array[String]} args
 * @param {String} cmd
 * @param {Discord.Message} msg
 */
module.exports = async (args, cmd, msg) => {
	const guildSettings = new GuildSettings(msg.guild)
	const field = args[0]
	const action = args[1]
	const msgColor = await guildSettings.get('msg-color')

	switch (action) {
		case 'set':
			if (!defaultSettings.has(field)) {
				msg.channel.send(
					new Discord.MessageEmbed()
						.setColor(msgColor)
						.setTitle('This setting does not exist')
				)
				return
			}

			const originalValue = (await guildSettings.get(field)) || 'Not set'
			const newValue = args[2]
			await guildSettings.set(field, newValue)
			msg.channel.send(
				new Discord.MessageEmbed()
					.setColor(msgColor)
					.setTitle(`Updated \`${field}\``)
					.addFields(
						{ name: 'Original Value', value: originalValue, inline: true },
						{ name: 'New Value', value: newValue, inline: true }
					)
			)
			break
		case 'get':
			const value = await guildSettings.get(field)
			msg.channel.send(
				new Discord.MessageEmbed()
					.setColor(msgColor)
					.addField('Name', field, true)
					.addField('Value', value, true)
			)
			break
	}
}
