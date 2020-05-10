const express = require('express')
const next = require('next')
const fileUpload = require('express-fileupload')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()

  server.use(fileUpload())

  server.post('/api/v1/uploads', (req, res) => {
    try {
      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.')
      }

      return res.status(200).json({ data: req.files.sampleFile.data.toString() })
    } catch (err) {
      console.error(err)
      return res.status(500).send('Internal server error')
    }
  })

  server.all('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, err => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})
