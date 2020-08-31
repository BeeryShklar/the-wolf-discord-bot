const Discord = require('discord.js')
const {
	GuildSettings,
	defaultSettings,
	settingsDescription,
} = require('../../settings')
const { parseRoleMention } = require('../../helpers/parseMentions')

/**
 * @param {Array[String]} args
 * @param {String} cmd
 * @param {Discord.Message} msg
 */
const cb = async (args, cmd, msg) => {
	const guildSettings = new GuildSettings(msg.guild)
	const field = args[0]
	const action = args[1] || ''
	const msgColor = await guildSettings.get('msg-color')

	const managerRoleId = parseRoleMention(
		await guildSettings.get('manager-role')
	)

	console.log(msg.member.permissions.has('ADMINISTRATOR'))
	if (
		!msg.member.permissions.has('ADMINISTRATOR') &&
		!msg.member.roles.cache.has(managerRoleId)
	) {
		return msg.channel.send(
			new Discord.MessageEmbed().setTitle(
				"You don't have permissions to use this commands"
			)
		)
	}

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
		case ('get', ''):
			const value = await guildSettings.get(field)
			msg.channel.send(
				new Discord.MessageEmbed()
					.setColor(msgColor)
					.addField('Name', field, true)
					.addField('Value', value || '_Not set_', true)
			)
			break
		case 'reset':
			guildSettings.delete(field)
			msg.channel.send(
				new Discord.MessageEmbed()
					.setTitle(`Reset \`${field}\``)
					.setColor(msgColor)
			)
			break
	}
}

const settingsDescriptionText = Object.keys(settingsDescription)
	.map(key => {
		return `\`${key}\` - ${settingsDescription[key]}`
	})
	.join('\n')
const help = (prefix, msg) => {
	return {
		command: 'tw [variable] [get|set|reset] (new value)',
		description: `Changes the bot's settings.
	Run \`${prefix}help tw\` for more information.`,
		long: `**Settings**:
		${settingsDescriptionText}
	`,
	}
}

module.exports = {
	cb,
	help,
}
