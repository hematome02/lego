const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const mongo = require("./mongoAtlas");
const connectToDatabase = require("./connection/conn.js");

const PORT = 8092;

const app = express();

module.exports = app;

app.use(require("body-parser").json());
app.use(cors());
app.use(helmet());

app.options("*", cors());
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


/*
app.get("/deals/search", async (request, response) => {
  const {
    limit = 12,
    price,
    date,
    filterBy,
    disc = 50,
    temp = 100,
    com = 15,
  } = request.query;
  try {
    let query = {};
    if (price) {
      query.price = { $lt: parseFloat(price) };
    } /*
    if (date) {
      const timestamp = new Date(date).getTime() / 1000;
      query.published = { $gte: timestamp };
    }*//*
    // Here filterBy can have 3 values: best-discount, most-commented, hot-deals
    if (filterBy) {
      switch (filterBy) {
        case "best-discount":
          query.promotion = { $gte: parseFloat(disc) }; // Filter by deals with >= 50% discount by default
          break;
        case "most-commented":
          query.commentaire = { $gte: parseFloat(com) }; // Filter by deals with more than 15 comments by default
          break;
        case "hot-deals":
          query.temperature = { $gte: parseFloat(temp) }; // Filter by deals >= 100 degrees by default
          break;
      }
    }
    const db = await connectToDatabase();
    let collection = db.collection("deals");
    let deals = await collection
      .find(query)
      .sort({ price: 1 })
      .limit(parseInt(limit))
      .toArray();

    const rep = {
      limit: parseInt(limit),
      total: deals.length,
      result: deals,
    };
    response.status(200).send(rep);
  } catch (error) {
    response
      .status(500)
      .send({ error: "An error occurred while searching for deals" });
  }
});*/

app.get("/deals", async (request, response) => {
  const { bestdiscount, mostcommented, hotdeals, sort } = request.query;
  let limit = parseInt(request.query.size);
  let page = parseInt(request.query.page);

  if (isNaN(limit)) {
    limit = 6; // Valeur par défaut si 'size' n'est pas un nombre valide
  }
  
  if (isNaN(page)) {
    page = 1; // Valeur par défaut si 'page' n'est pas un nombre valide
  }

  console.log(page);  
  console.log(limit);

  try {
    let query ={};
    if (bestdiscount == "true") {
      query.promotion = { $gte: parseFloat(50) }; // Filter by deals with >= 50% discount by default
    }
    if (mostcommented === "true") {
      query.commentaire = { $gte: parseFloat(15) }; // Filter by deals with more than 15 comments by default
    }
    if (hotdeals=== "true") {
      query.temperature = { $gte: parseFloat(100) }; // Filter by deals >= 100 degrees by default
    }

    const db = await connectToDatabase();
    let collection = db.collection("deals");
    let deals;
    switch(sort) {
      case "expensive":
        deals = await collection.find(query).sort({ price: -1 }).toArray();
        break; 

      case "cheaper" :
        deals = await collection.find(query).sort({ price: 1 }).toArray();
        break;
      
      case "recently published":
        deals = await collection.find(query).sort({ publication: -1 }).toArray();
        break; 

      case "anciently published":
        deals = await collection.find(query).sort({ publication: 1 }).toArray();
        break; 
      
        default:
          deals = await collection.find(query).toArray();
          break;
    }
    //deals = await collection.find(query).toArray();
    let displayDeals ={};
      
      if(page === null || limit === null){
        displayDeals = deals;
      }else{
        let start = limit*(page-1);
        let end = start + limit;  // Calculate the ending index based on the limit

        console.log(start)
        console.log(end)
      
        // Slice the 'deal' array based on the start and end indices
        displayDeals = deals.slice(start, end); 
      }



    const rep = {
      success: true,
      data: {
        result: displayDeals,
        meta: {
          currentPage: page,
          pageCount: Math.ceil(deals.length/limit),
          pageSize: limit,
          count: deals.length
        }
      },
      // limit: parseInt(limit),
      // total: deals.length,
      // result: displayDeals,
    };
    response.status(200).send(rep);
  } catch (error) {
    console.log(error)
    response
      .status(500)
      .send({ error: "An error occurred while searching for deals" });
  }
});
/*
let id = "675706f869a94d8f3b355e60";
app.get("/deals/:id", (request, response) => {
  const dealId = request.params.id;
  mongo
    .dealId(dealId)
    .then((deal) => {
      response.send({ test: deal });
    })
    .catch((error) => {
      response
        .status(500)
        .send({ error: "Erreur lors de la récupération du deal" });
    });
});*/

//let id = "10273 ";
app.get("/sales/:id", (request, response) => {
  const dealId = request.params.id;
  
  mongo.saleId(dealId)
    .then((deal) => {
      response.status(200).send({
        success : true, 
        data : {
          result : deal
        }});
    })
    .catch((error) => {
      response
        .status(500)
        .send({ error: "Erreur lors de la récupération du sales" });
    });
});
/*

  mongo.saleId(dealId)  
  .then((deal) => {
    response.send({ test: deal });
  //  })
   // .catch((error) => {
   //   rsponse
   //     .status(500)
   //     .send({ error: "Erreur lors de la récupération du sales" });
    //}
},
);*/
/*
app.get('/sales/search', async (request, response) => {
  const { limit = 12, legoSetId } = request.query;
  try {
    if (!legoSetId) {
      return response.status(400).send({ error: 'legoSetId is required' });
    }

    let collectionName = legoSetId.toString();
    let collection = db.collection(collectionName);
    let sales = await collection.find()
      .sort({ published: -1 })
      .limit(parseInt(limit))
      .toArray();

    const rep = {
      limit: parseInt(limit),
      total: sales.length,
      result: sales
    };

    response.status(200).send(rep);
  } catch (error) {
    response.status(500).send({ error: 'An error occurred while searching for sales' });
  }
});*/

app.get("/deals/:id",(request, response) => {
  const dealId = request.params.id;
  console.log(dealId);
  mongo.dealPriceId(dealId)
    .then((deal) => {
      console.log("app", deal);
      response.status(200).send({        
        success : true, 
        deal
        });
    })
    .catch((error) => {
      console.log(error);
      response
        .status(500)
        .send({ error: "Erreur lors de la récupération du prix" });
    });
});

/*
app.get("/deals/tt", (request, response) => {
  let limit = parseInt(request.query.size) ?? null;
  let page = parseInt(request.query.page) ?? null;

  console.log(page)
  console.log(limit)

  mongo
    .deal()
    .then((deal) => {
      let displayDeals ={};
      
      if(page === null || limit === null){
        displayDeals = deal;
      }else{
        let start = limit*page;
        let end = start + limit;  // Calculate the ending index based on the limit

        console.log(start)
        console.log(end)
      
        // Slice the 'deal' array based on the start and end indices
        displayDeals = deal.slice(start, end); 
      }


      response.send(displayDeals);
    })
    .catch((error) => {
      console.log(error)
      response
        .status(500)
        .send({ error: "Erreur lors de la récupération du deal" });
    });
});*/

app.listen(PORT);

console.log(`📡 Running on port ${PORT}`);
