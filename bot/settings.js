const Discord = require('discord.js')
const NedbMap = require('./helpers/nedb-map')
const db = new NedbMap({ filename: './settings.db' })
// const db = new Map()

const defaultSettings = new Map(
	Object.entries({
		prefix: '!',
		'msg-color': '#16A585',
		'manager-role': undefined,
		'reply-new': {
			help:
				'If you want help with bot commands type `!help` (prefix might vary)',
		},
		'reply-modify': {
			hi: 'bye',
			היי: 'ביי',
		},
		'reply-role': undefined,
	})
)
const settingsDescription = {
	prefix: "The prefix of all the bot's commands",
	'msg-color': "The color of the bot's messages",
	'manager-role': "People that have this role can use the bot's admin commands",
	'reply-new':
		'Sends a new message when a message starts with `x`.\n**Value:** A js object where the keys are the prefixes and the values are the messages',
	'reply-modify':
		'Sends the same message when a message starts with `x` but modifies `x` to be `y`.\n**Value:** A js object where the keys are `x` and the values are `y`',
	'reply-role':
		'The role that users have to have for the bot to reply to them.',
}

class GuildSettings {
	/**
	 * @param {Discord.Guild} guild
	 */
	constructor(guildId) {
		this.guildId = guildId
	}

	/**
	 * @return {Map}
	 */
	async getGuildSettings() {
		return new Map(await db.get(this.guildId))
	}
	/**
	 * @param {String} field
	 */
	async get(field) {
		const map = await this.getGuildSettings()
		const valAtField = map.get(field)
		const defaultSettingsAtField = defaultSettings.get(field)
		return valAtField || defaultSettingsAtField
	}
	/**
	 * @param {String} field
	 * @param {any} value
	 */
	async set(field, value) {
		const map = await this.getGuildSettings()
		map.set(field, value)
		if (value === defaultSettings.get(field)) return this.delete(field)
		db.set(this.guildId, [...map])
		return map
	}
	/**
	 * @param {String} field
	 */
	async delete(field) {
		const map = await this.getGuildSettings()
		map.delete(field)
		db.set(this.guildId, [...map])
	}
}

module.exports = {
	GuildSettings,
	defaultSettings,
	settingsDescription,
}
