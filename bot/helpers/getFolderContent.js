const fs = require('fs').promises
const path = require('path')

/**
 * Return all items in an array with their name, extension, full path and a way to require them.
 * @param {String} folderPath
 */
module.exports = async folderPath => {
	const content = await fs.readdir(folderPath)
	return content.map(file => {
		return {
			ext: path.extname(file),
			name: path.parse(file).name,
			fullPath: path.join(folderPath, file),
			get handler() {
				return require(path.join(folderPath, file))
			},
		}
	})
}
