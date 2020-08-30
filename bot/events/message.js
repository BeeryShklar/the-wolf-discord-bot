const Discord = require('discord.js')
const fs = require('fs').promises
const path = require('path')
const { GuildSettings } = require('../settings')
const getFolderContent = require('../helpers/getFolderContent')

/**
 * @param {Discord.Message} msg
 */
module.exports = msg => {
	if (msg.author.bot) return new Error('Author is a bot')
	const guildSettings = new GuildSettings(msg.guild)

	const prefix = guildSettings.get('prefix')
	if (msg.content.startsWith(prefix)) {
		const split = msg.content.split(/\s/)
		const cmd = split[0].replace(prefix, '')
		const args = split.splice(1)
		runMatchingCommands(cmd, args, msg)
	}
}

/**
 * @param {String} cmd
 * @param {Array} args
 * @param {Discord.Message} msg
 * @param {String} content
 */
async function runMatchingCommands(cmd, args, msg) {
	const folderName = 'commands'
	const normalizedPath = path.join(__dirname, folderName)

	const content = await getFolderContent(normalizedPath)
	content.forEach(file => {
		if (file.ext !== '.js') return
		if (file.name === cmd) {
			file.handler(args, cmd, msg)
		}
	})
}
