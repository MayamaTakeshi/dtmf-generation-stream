const DtmfGenerationStream = require('../index.js')
const Speaker = require('speaker')

const format = {
	sampleRate: 8000, 
	bitDepth: 16,
	channels: 1
}

const params = {
  text: '0123456789abcd*#',
  times: Infinity,
}

const opts = {
  format,
  params,
}

const dgs = new DtmfGenerationStream(opts)

const s = new Speaker(format)

dgs.pipe(s)
