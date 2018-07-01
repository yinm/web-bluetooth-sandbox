let bluetoothDevice

function onButtonClick() {
  bluetoothDevice = null
  log('Requesting Bluetooth Device...')
  navigator.bluetooth.requestDevice({
    filters: [
      {namePrefix: 'konashi2'},
    ]
  })
    .then(device => {
      bluetoothDevice = device
      bluetoothDevice.addEventListener('gattserverdisconnected', onDisconnected)
      connect()
    })
    .catch(error => {
      log(`Argh! ${error}`)
    })
}

function connect() {
  exponentialBackoff(3, 2,
    function toTry() {
      time('Connecting to Bluetooth Device...')
      return bluetoothDevice.gatt.connect()
    },
    function success() {
      log('> Bluetooth Device connected. Try disconnect it now.')
    },
    function fail() {
      time('Failed to reconnect.')
    }
  )
}

function onDisconnected() {
  log('> Bluetooth Device disconnected')
  connect()
}

function exponentialBackoff(max, delay, toTry, success, fail) {
  toTry()
    .then(result => success(result))
    .catch(_ => {
      if (max === 0) {
        return fail()
      }
      time(`Retrying in ${delay}s...(${max} tries left)`)
      setTimeout(() => {
        exponentialBackoff(--max, delay * 2, toTry, success, fail)
      }, delay * 1000)
    })
}

function time(text) {
  log(`[${new Date().toJSON().substr(11, 8)}] ${text}`)
}
