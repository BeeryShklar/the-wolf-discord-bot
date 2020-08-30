const Discord = require('discord.js')
const settings = require('../../settings')

/**
 * @param {Array[String]} args
 * @param {String} cmd
 * @param {Discord.Message} msg
 */
const cb = (args, cmd, msg) => {
	msg.reply('מה המצב?')
}

const help = () => ({
	command: 'hi',
	description: 'Replies with hi.',
})

module.exports = {
	cb,
	help,
}
