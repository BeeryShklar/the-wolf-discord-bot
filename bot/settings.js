const Discord = require('discord.js')
const NedbMap = require('./helpers/nedb-map')
const db = new NedbMap({ filename: './settings.db' })
// const db = new Map()

const defaultSettings = new Map(
	Object.entries({
		prefix: '!',
		'msg-color': '#FEB120',
	})
)

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
		const map = await this.getGuildSettings()
		map.set(field, value)
		const setValue = await db.set(this.guildId, [...map])
		return map
	}
	/**
	 * @param {String} field
	 */
	async reset(field) {
		if (!defaultSettings.has(field)) return new Error('No such field')
		const map = await this.getGuildSettings()
		map.set(field, defaultSettings.get(field))
	}
}

module.exports = {
	GuildSettings,
	defaultSettings,
}
