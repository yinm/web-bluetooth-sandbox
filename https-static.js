const https = require('https')
const statics = require('node-static')
const fs = require('fs')
const st = new(statics.Server)()
const port = 8443

const sslServerKey = 'server_key.pem'
const sslServerCrt = 'server_crt.pem'
const options = {
  key: fs.readFileSync(sslServerKey),
  cert: fs.readFileSync(sslServerCrt),
}

https.createServer(options, (req, res) => {
  st.serve(req, res)
})
  .listen(port)
