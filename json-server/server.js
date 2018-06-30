// Json server configuration for start fake server
const fs = require('fs');
let jsonServer = require('json-server')
let server = jsonServer.create()
let router = jsonServer.router(require('./main.js')())
let middlewares = jsonServer.defaults();
let port = 3000;
// Rutas personalizadas
let rewriterRules = require('./routes.js')();
server.use(middlewares)
server.use(jsonServer.bodyParser)

// Agrego las rutas personalizadas para los diferentes json que se crearon
server.use(jsonServer.rewriter(rewriterRules));


// Metodos post o get
server.use((req, res, next) => {
  if (req.method === 'POST') {
    // Converts POST to GET and move payload to query params
    // This way it will make JSON Server that it's GET request
    req.method = 'GET'
    req.query = req.body
  }
  // Continue to JSON Server router
  next()
})

// If you need to scope this behaviour to a particular route, use this
server.post('/comments', (req, res, next) => {
  req.method = 'GET'
  req.query = req.body
  next()
})




// Start server
server.use(router)
server.listen(port, () => {
  console.log(`JSON Server is running in http://localhost:${3000}/`)
})
