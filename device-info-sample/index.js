document.addEventListener('DOMContentLoaded', () => {
  const ChromeSamples = {
    log() {
      const line = Array.prototype.slice.call(arguments).map(argument => {
        return typeof argument === 'string' ?
          argument :
          JSON.stringify(argument)
      })
        .join(' ')

      document.querySelector('#log').textContent += line + '\n'
    },

    clearLog() {
      document.querySelector('#log').textContent = ''
    },

    setStatus(status) {
      document.querySelector('#status').textContent = status
    },

    setContent(newContent) {
      let content = document.querySelector('#content')
      while (content.hasChildNodes()) {
        content.removeChild(content.lastChild)
      }
      content.appendChild(newContent)
    }
  }

  const log = ChromeSamples.log

  function onButtonClick() {
    let filters = []

    let filterService = document.querySelector('#service').value
    if (filterService.startsWith('0x')) {
      filterService = parseInt(filterService)
    }
    if (filterService) {
      filters.push({ services: [filterService] })
    }

    let filterName = document.querySelector('#name').value
    if (filterName) {
      filters.push({ name: filterName })
    }

    let filterNamePrefix = document.querySelector('#namePrefix').value
    if (filterNamePrefix) {
      filters.push({ namePrefix: filterNamePrefix })
    }

    let options = {}
    // if (document.querySelector('#allDevices').checked) {
    //   options.acceptAllDevices = true
    // } else {
      options.filters = filters
    // }

    log('Requesting Bluetooth Device...')
    log(`with ${JSON.stringify(options)}`)
    navigator.bluetooth.requestDevice(options)
      .then(device => {
        log(`> Name: ${device.name}`)
        log(`> Id: ${device.id}`)
        log(`> Connected: ${device.gatt.connected}`)
      })
      .catch(error => {
        log(`Argh! ${error}`)
      })
  }

  document.querySelector('form').addEventListener('submit', (event) => {
    event.stopPropagation()
    event.preventDefault()

    ChromeSamples.clearLog()
    onButtonClick()
  })


}, false)

