const bot = require('./bot')
const express = require('express')
const app = express()
require('dotenv').config()

app.get('/', (req, res) => {
	res.send('BAD WOLF Bot is online!')
})

bot.login(process.env.DISCORD_BOT_TOKEN)

const PORT = process.env.PORT || 3000
app.listen(PORT, err => {
	if (err) console.log(err)
	console.log(`Server running on port: ${PORT}`)
})
