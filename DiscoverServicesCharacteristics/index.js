async function onButtonClick() {
  // Validate services UUID entered by user first.
  let optionalServices = document.querySelector('#optionalServices').value
    .split(/, ?/).map(s => s.startsWith('0x') ? parseInt(s) : s)
    .filter(s => s && BluetoothUUID.getService)

  try {
    log('Requesting Bluetooth Device...')
    const device = await navigator.bluetooth.requestDevice({
      filters: [
        {namePrefix: 'konashi2'},
      ],
      optionalServices: optionalServices,
    })

    log('Connecting to GATT Server...')
    const server = await device.gatt.connect()

    log('Getting Services...')
    const services = await server.getPrimaryServices()

    log('Getting Characteristics...')
    for (const service of services) {
      log(`> Service: ${service.uuid}`)
      const characteristics = await service.getCharacteristics()

      characteristics.forEach(characteristic => {
        log(
          '>> Characteristic: ' + characteristic.uuid + ' ' +
          getSupportedProperties(characteristic)
        )
      })
    }

  } catch(error) {
    log(`Argh! ${error}`)
  }
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
