const express = require("express");
const apisRoutesProcess = require("./process/app.routers.fork");
const cluster = require("cluster");
const os = require("os");
const config = require("./config");
const logger = require("./logger/winston");
require('dotenv').config()



// const PORT = process.argv[2] || 8080;
const PORT = +process.env.PORT || 8080;

const app = express();

app.use("/api", apisRoutesProcess);


app.get("/", (req, res) => {
  res.send("<h1>Pagina Home</h1>");
});


//Muestra servidor
app.get("/datos", (req, res) => {
  const html = `Servidor express <span style="color: coral; font-weight: bold;">(NginX)</span> | ${PORT} - <b>PID => ${
    process.pid
  }</b> - ${new Date().toLocaleString()}`;
  res.send(html);
});

app.use('*', (req, res)=>{
    res.status(404).send({error:-2, descripcion:`ruta ${req.baseUrl} metodo ${req.method} no implementado`})
    if (res.status(404)) logger.warn("Ruta no existente")
});

const clusterMode = process.argv[3] === "CLUSTER";

if (clusterMode && cluster.isPrimary) {
  const NUM_WORKERS = os.cpus().length; //cantidad de nucleos
  for (let i = 0; i < NUM_WORKERS; i++) {
    cluster.fork();
  }
} else {
  app.listen(PORT, config.HOST, () => {
    // console.log(`Server listening on http://${config.HOST}:${PORT}`);
    logger.log('info',`Server listening on http://${config.HOST}:${PORT}`);
  });
}