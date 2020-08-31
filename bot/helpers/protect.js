const Discord = require('discord.js')
const { parseRoleMention } = require('./parseMentions')
const { GuildSettings } = require('../settings')

/**
 * @param {Discord.GuildMember} member
 * @param {Discord.Snowflake} guildId
 */
const protectAdmin = async (member, guildId) => {
	const guildSettings = new GuildSettings(guildId)
	const adminRoleId = parseRoleMention(await guildSettings.get('admin-role'))

	return (
		member.permissions.has('ADMINISTRATOR') ||
		member.roles.cache.has(adminRoleId)
	)
}

/**
 * @param {Discord.GuildMember} member
 * @param {Discord.Snowflake} guildId
 */
const protectReply = async (member, guildId) => {
	const guildSettings = new GuildSettings(guildId)
	const adminRoleId = parseRoleMention(await guildSettings.get('admin-role'))

	return member.roles.cache.has(adminRoleId)
}

module.exports = {
	protectAdmin,
	protectReply,
}
