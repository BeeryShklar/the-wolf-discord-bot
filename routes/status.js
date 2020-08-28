const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
	res.status(200)
	res.send('The Wolf Discord Bot is online')
})

module.exports = router
