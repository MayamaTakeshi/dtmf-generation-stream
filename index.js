const { ToneStream, utils, ssml } = require("tone-stream")

const xml = require("xml-js")

const DEFAULT_DIGIT_DURATION = 50

function gen_digits(sampleRate, text, duration) {
  //console.log("gen_digits", text, duration)
  if (text.match(/[^0-9a-fA-F\*\#]/)) {
    throw `parse-failure: invalid DTMF sequence '${text}'`
  }

  const tones = utils.gen_dtmf_tones(
    text,
    duration,
    duration,
    sampleRate,
  )
  //console.log("tones", tones)
  return tones
}

class DtmfGenerationStream extends ToneStream {
  constructor(opts) {
    super(opts.format);
    this.format = opts.format;

    this.params = opts.params
    if(!this.params.times) {
      this.params.times = 1
    }
    
    this.on('empty', () => {
      //console.log('empty')
      this.params.times--
      //console.log("times", this.params.times)
      if(this.params.times > 0) {
        this.enqueue(this.params)
      }
    })

    this.enqueue(this.params)
  }

  enqueue(params) {
    const tones = ssml.process(this.format.sampleRate, params.text, gen_digits, DEFAULT_DIGIT_DURATION)
    this.concat(tones)
  }
}

module.exports = DtmfGenerationStream
