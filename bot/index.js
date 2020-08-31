const Discord = require('discord.js')
const fs = require('fs').promises
const path = require('path')
const getFolderContent = require('./helpers/getFolderContent')
const { fileURLToPath } = require('url')

const client = new Discord.Client()
initHandlers()
console.log('Discord Bot Running')

module.exports = client

async function initHandlers() {
	const folderName = 'events'
	const normalizedPath = path.join(__dirname, folderName)

	const content = await getFolderContent(normalizedPath)
	content.forEach(file => {
		if (file.ext !== '.js') return
		const eventName = file.name
		client.on(eventName, args => {
			try {
				file.handler(args, client)
			} catch (err) {
				console.error(err)
			}
		})
	})
}
