const Discord = require('discord.js')

const prefix = '!'

/**
 * @param {Discord.Message} msg
 */
module.exports = msg => {
	if (msg.author.bot) return new Error('Author is a bot')

	const content = msg.content
	const args = content.split(' ').splice(0, 1)
	const command = content.split(' ')[0].startsWith(prefix)
		? content.split(' ')[0].slice(1)
		: undefined

	if (command) matchCommands(msg, command, args, content)
}

/**
 * @param {Discord.Message} msg
 * @param {String} command
 */
function matchCommands(msg, command) {
	switch (command) {
		case 'hi':
			msg.reply('מה המצב?')
			break
	}
}
