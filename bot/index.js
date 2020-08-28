const Discord = require('discord.js')
const fs = require('fs').promises
const path = require('path')

const client = new Discord.Client()
initHandlers()
console.log('Discord Bot Running')

module.exports = client

async function initHandlers() {
	try {
		const folderName = 'events'
		const normalizedPath = path.join(__dirname, folderName)

		const items = await fs.readdir(normalizedPath)
		items.forEach(item => {
			const handler = require(`./${folderName}/${item}`)
			const eventName = path.parse(item).name
			if (path.extname(item) === '.js')
				client.on(eventName, args => {
					handler(args, client)
				})
		})
	} catch (err) {
		throw err
	}
}
