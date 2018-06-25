function onButtonClick() {
  // Validate services UUID entered by user first.
  let optionalServices = document.querySelector('#optionalServices').value
    .split(/, ?/).map(s => s.startsWith('0x') ? parseInt(s) : s)
    .filter(s => s && BluetoothUUID.getService)

  log('Requesting Bluetooth Device...')
  navigator.bluetooth.requestDevice({
    filters: [
      {namePrefix: 'konashi2'},
    ],
    optionalServices: optionalServices,
  })
    .then(device => {
      // Note that we could also get all services that match a specific UUID by
      // passing it to getPrimaryServices().
      log('Getting Services...')
      return server.getPrimaryServices()
    })
    .then(services => {
      log('Getting Characteristics...')
      let queue = Promise.resolve()
      services.forEach(service => {
        queue = queue
          .then(_ => {
            return service.getCharacteristics()
          })
          .then(characteristics => {
            log(`> Service: ${service.uuid}`)
            characteristics.forEach(characteristics => {
              log(
                '>> Characteristic: ' + characteristic.uuid + ' ' +
                getSupportedProperties(characteristic)
              )
            })
          })
      })

      return queue
    })
    .catch(error => {
      log(`Argh! ${error}`)
    })
}

// Utils

function getSupportedProperties(characteristic) {
  let supportedProperties = []
  for (const p in characteristic.properties) {
    if (characteristic.properties[p] === true) {
      supportedProperties.push(p.toUpperCase())
    }
  }

  return `[${supportedProperties.join(', ')}]`
}
