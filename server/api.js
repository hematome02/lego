const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const mongo = require("./mongoAtlas");

const PORT = 8092;

const app = express();

module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());

app.options('*', cors());
/* otion de base
app.get('/', (request, response) => {
  response.send({'ack': true});
});
*/
/*
app.get('/deals/id', (request,response)=> {
  const deal = await mongo.deal();
  response.send({ 'test': deal });
  //response.send({'test': mongo.deal()})
});*/

app.get('/deals/', (request, response) => {
  mongo.deal().then(deal => {
    response.send({ 'test': deal });
  }).catch(error => {
    response.status(500).send({ 'error': 'Erreur lors de la récupération du deal' });
  });
});

let id ='6742181ffd7308737154b6ea';
app.get('/deals/:id', (request, response, id) => {
  mongo.dealId(id).then(deal => {
    response.send({ 'test': deal });
  }).catch(error => {
    response.status(500).send({ 'error': 'Erreur lors de la récupération du deal' });
  });
});


app.listen(PORT);

console.log(`📡 Running on port ${PORT}`);
