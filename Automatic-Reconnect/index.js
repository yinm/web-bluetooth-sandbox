let bluetoothDevice

async function onButtonClick() {
  bluetoothDevice = null

  try {
    log('Requesting Bluetooth Device...')
    bluetoothDevice = await navigator.bluetooth.requestDevice({
      filters: [
        {namePrefix: 'konashi2'},
      ]
    })
    bluetoothDevice.addEventListener('gattserverdisconnected', onDisconnected)
    connect()
  } catch(error) {
    log(`Argh! ${error}`)
  }
}

function connect()  {
  exponentialBackoff(3, 2,
    async function toTry() {
      time('Connecting to Bluetooth Device...')
      await bluetoothDevice.gatt.connect()
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

async function exponentialBackoff(max, delay, toTry, success, fail) {
  try {
    const result = await toTry()
    success(result)
  } catch(error) {
    if (max === 0) {
      return fail()
    }

    time(`Retrying in ${delay}s...(${max} tries left)`)
    setTimeout(() => {
      exponentialBackoff(--max, delay * 2, toTry, success, fail)
    }, delay * 1000)
  }
}

function time(text) {
  log(`[${new Date().toJSON().substr(11, 8)}] ${text}`)
}
