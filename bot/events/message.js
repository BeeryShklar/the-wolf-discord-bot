const Discord = require('discord.js')
const fs = require('fs').promises
const path = require('path')
const { GuildSettings } = require('../settings')
const getFolderContent = require('../helpers/getFolderContent')
const { parseRoleMention } = require('../helpers/parseMentions')
const { protectReply } = require('../helpers/protect')

/**
 * @param {Discord.Message} msg
 */
module.exports = async msg => {
	if (msg.author.bot) return new Error('Author is a bot')
	const guildSettings = new GuildSettings(msg.guild.id)

	if (await protectReply(msg.member, msg.guild.id)) {
		matchReplyNewPrefixes(msg, guildSettings)
		matchReplyModifyPrefixes(msg, guildSettings)
	}

	// Commands
	const prefix = await guildSettings.get('prefix')
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
			file.handler.cb(args, cmd, msg)
		}
	})
}

// Match reply prefixes
async function matchReplyNewPrefixes(msg, guildSettings) {
	const replyNewPrefixes = await guildSettings.get('reply-new')
	Object.keys(replyNewPrefixes).forEach(replyPrefix => {
		if (msg.content.toLowerCase().startsWith(replyPrefix))
			msg.channel.send(replyNewPrefixes[replyPrefix])
	})
}

async function matchReplyModifyPrefixes(msg, guildSettings) {
	const replyModifyPrefixes = await guildSettings.get('reply-modify')
	Object.keys(replyModifyPrefixes).forEach(replyPrefix => {
		if (msg.content.toLowerCase().startsWith(replyPrefix))
			msg.channel.send(
				msg.content.replace(replyPrefix, replyModifyPrefixes[replyPrefix])
			)
	})
}
