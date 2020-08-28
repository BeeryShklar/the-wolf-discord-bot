const bot = require('./bot')
const express = require('express')
const app = express()
require('dotenv').config()

const status = require('./routes/status')

const authorizeUrl =
	'https://discord.com/oauth2/authorize?client_id=748565893956501584&scope=bot&permissions=8'
app.get('/', (req, res) => {
	res.redirect(authorizeUrl)
})

app.use('/status', status)

// bot.login(process.env.DISCORD_BOT_TOKEN)

const PORT = process.env.PORT || 3000
app.listen(PORT, err => {
	if (err) console.log(err)
	console.log(`Server running on port: ${PORT}`)
})
