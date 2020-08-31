const Discord = require('discord.js')
const { GuildSettings } = require('../../settings')
const getFolderContent = require('../../helpers/getFolderContent')
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
	const content = await getFolderContent(__dirname)

	const fileNames = content.map(file => file.name)
	if (fileNames.includes(args[0]))
		renderSpecificCommand(args[0], msg, content, prefix, guildSettings)
	else renderAllCommands(msg, content, prefix, guildSettings)
}

const help = () => ({
	command: 'help (command)',
	description: 'Show this menu.',
})

module.exports = {
	cb,
	help,
}

async function renderAllCommands(msg, content, prefix, guildSettings) {
	const commandsList = content
		.filter(file => file.ext === '.js')
		.sort((a, b) => (a.name > b.name ? 1 : -1))
		.map(file => {
			const help = file.handler.help ? file.handler.help(prefix, msg) : {}
			const command = help.command || file.name
			const description = help.description || 'Description not found'

			return `
			\`${prefix}${command}\`
			${description}
			`
		})
		.join('')
	msg.channel.send(
		new Discord.MessageEmbed()
			.setColor(await guildSettings.get('msg-color'))
			.setAuthor('The Wolf Bot Help')
			.addField('Commands', commandsList)
	)
}

async function renderSpecificCommand(
	cmdName,
	msg,
	content,
	prefix,
	guildSettings
) {
	const file = content.filter(file => file.name === cmdName)[0]
	const help = file.handler.help(prefix, msg)
	if (!help)
		return msg.channel.send(
			new Discord.MessageEmbed()
				.setColor(await guildSettings.get('msg-color'))
				.setAuthor('The Wolf Bot Help')
				.setTitle('Error')
				.setDescription(`Couldn't find a help page for that commands`)
		)
	const longDescription =
		help.long ||
		`**Description**:
		${help.description || 'Description not found'}`
	msg.channel.send(
		new Discord.MessageEmbed()
			.setColor(await guildSettings.get('msg-color'))
			.setAuthor('The Wolf Bot Help').setDescription(`
			**Syntax:**
			\`${help.command || ''}\`

			${longDescription}`)
	)
}
