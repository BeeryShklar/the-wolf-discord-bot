const Discord = require('discord.js')
const db = new Map()
const defaultSettings = new Map(
	Object.entries({
		prefix: '!',
	})
)

class GuildSettings {
	/**
	 * @param {Discord.Guild} guild
	 */
	constructor(guild) {
		this.guild = guild
	}

	/**
	 * @return {Map}
	 */
	get map() {
		const exists = db.has(this.guild)
		if (!exists) db.set(this.guild, new Map(defaultSettings))
		return db.get(this.guild)
	}
	/**
	 * @param {String} field
	 */
	get(field) {
		return this.map.get(field)
	}
	/**
	 * @param {String} field
	 * @param {any} value
	 */
	set(field, value) {
		return this.map.set(field, value)
	}
	/**
	 * @param {String} field
	 */
	reset(field) {
		this.map.set(field, defaultSettings.get(field))
	}
}

module.exports = {
	GuildSettings,
}
