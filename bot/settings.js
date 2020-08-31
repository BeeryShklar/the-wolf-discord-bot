const Discord = require('discord.js')
const NedbMap = require('./helpers/nedb-map')
const db = new NedbMap({ filename: './settings.db' })
// const db = new Map()

const defaultSettings = new Map(
	Object.entries({
		prefix: '!',
		'msg-color': '#16A585',
		'manager-role': undefined,
		'reply-prefixes': {
			היי: 'ביי',
			hi: 'Bye',
		},
	})
)
const settingsDescription = {
	prefix: "The prefix of all the bot's commands",
	'msg-color': "The color of the bot's messages",
	'manager-role': "People that have this role can use the bot's admin commands",
	'reply-prefixes':
		'An object where the keys are the the prefix and the values are the reply message',
}

class GuildSettings {
	/**
	 * @param {Discord.Guild} guild
	 */
	constructor(guild) {
		this.guildId = guild.id
	}

	/**
	 * @return {Map}
	 */
	async getGuildSettings() {
		const exists = await db.has(this.guildId)
		if (!exists) await db.set(this.guildId, [])
		return new Map(await db.get(this.guildId))
	}
	/**
	 * @param {String} field
	 */
	async get(field) {
		const map = await this.getGuildSettings()
		return map.get(field) || defaultSettings.get(field)
	}
	/**
	 * @param {String} field
	 * @param {any} value
	 */
	async set(field, value) {
		if (value === defaultSettings.get(field)) this.delete(field)
		const map = await this.getGuildSettings()
		map.set(field, value)
		db.set(this.guildId, [...map])
		return map
	}
	/**
	 * @param {String} field
	 */
	async delete(field) {
		if (!defaultSettings.has(field)) return new Error('No such field')
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
