const DtmfGenerationStream  = require('../index.js')
const Speaker = require('speaker')

const format = {
	sampleRate: 8000, 
	bitDepth: 16,
	channels: 1
}

const params = {
  text: '<speak><prosody rate="50ms">1234</prosody><break time="500ms"/><prosody rate="100ms">1234</prosody></speak>',
  times: 3,
}

const opts = {
  format,
  params,
}

const dgs = new DtmfGenerationStream(opts)

const s = new Speaker(format)

dgs.pipe(s)
