const parseRoleMention = mention => {
	const id = mention ? (mention.match(/^<@&(\d+)>$/) || [])[1] : undefined
	return id
}

module.exports = {
	parseRoleMention,
}
