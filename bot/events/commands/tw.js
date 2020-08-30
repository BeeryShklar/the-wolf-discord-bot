const Discord = require('discord.js')
const { GuildSettings } = require('../../settings')

/**
 * @param {Array[String]} args
 * @param {String} cmd
 * @param {Discord.Message} msg
 */
module.exports = (args, cmd, msg) => {
	const guildSettings = new GuildSettings(msg.guild)
	const field = args[0]
	const action = args[1]

	switch (action) {
		case 'set':
			const value = args[2]
			guildSettings.set(field, value)
			msg.channel.send(`Field \`${field}\` set to \`${value}\``)
			break
		case 'get':
			msg.channel.send(
				guildSettings.get(field) || 'This setting does not exist'
			)
	}
}
