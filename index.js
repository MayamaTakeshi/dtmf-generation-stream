const { ToneStream, utils} = require('tone-stream')

const xml = require('xml-js')


const DEFAULT_DIGIT_DURATION = "50ms"

class DtmfGenerationStream extends ToneStream {
  constructor(format, opts) {
    super(format, opts)
    this.format = format
  }

  enqueue(content) {
    var elements = content
    if(content.startsWith('<speak>')) {
      content = xml.xml2js(content)
      elements = content.elements[0].elements
    } else {
      elements = [
        {
            "type": "text",
            "text": elements,
        },
      ]
    }

    //console.log(elements)

    this.add([800, 's']) // initial silence
    this.process_elements(elements)
    this.add([800, 's']) // final silence
  }

  parse_duration(duration) {
    if(duration.endsWith("ms")) {
        return parseInt(duration) 
    } else if(duration.endsWith("s")) {
        return parseInt(duration) * 1000
    } else {
        throw `parse-failure: invalid duration ${duration}`
    }
  }
  
  push_silence(duration) {
    var milliseconds = this.parse_duration(duration)
    var samples = Math.round(this.format.sampleRate / 1000 * milliseconds)
    this.add([samples, 's'])
  }

  push_digits(digits, duration) {
    var milliseconds = this.parse_duration(duration)

    if(digits.match(/[^0-9a-fA-F\*\#]/)) {
        throw `parse-failure: invalid DTMF sequence '${digits}'`
    }

    this.concat(utils.gen_dtmf_tones(digits, milliseconds, milliseconds, this.format.sampleRate))
  }

  process_elements(elements) {
    var res
    for(var i=0 ; i<elements.length ; i++) {
      var e = elements[i]
      if(e.type == 'text') {
          this.push_digits(e.text, DEFAULT_DIGIT_DURATION)
      } else if(e.type == 'element' && e.name == 'prosody'
            && e.attributes.rate
            && e.elements && e.elements[0] && e.elements[0].type == 'text') {
          this.push_digits(e.elements[0].text, e.attributes.rate)
      } else if(e.type == 'element' && e.name == 'break'
            && typeof e.attributes.time == 'string') {
          this.push_silence(e.attributes.time)
      } else {
          throw(`parse-failure: invalid SSML element ${JSON.stringify(e)}`)
      }
    }
  }
}

module.exports = {
  DtmfGenerationStream
}