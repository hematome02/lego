require(`dotenv`).config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://emmafromager:${process.env.SECRET_KEY}@lego.tb3vb.mongodb.net/?retryWrites=true&w=majority&appName=Lego`;

//Crée un client Mongo pour créer la version API stable
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

//Fonction de netoyage de la base de donnée
module.exports.mongoClear = async (obj, name) => {
  try {
    //Ouvre la connexion
    await client.connect();
    const db = client.db("LegoDB");
    const collections = await db.listCollections().toArray(); // Liste toutes les collections de la base
    for (const collection of collections) {
      await db.collection(collection.name).drop(); // Supprime chaque collection
      console.log(`Collection '${collection.name}' supprimée.`);
    }
  } finally {
    //Ferme la connexion à la fin de la commande ou si erreur
    await client.close();
  }
};

//Function d'ajout à la base de donnée des deals et ventes sur Vinted
module.exports.run = async (obj, name) => {
  try {
    //Ouvre la connexion
    await client.connect();
    const db = client.db("LegoDB");
    const collection = db.collection(name);
    //await collection.deleteMany({});
    const resultat = await collection.insertMany(obj);
    //console.log(resultat);
  } finally {
    //Ferme la connexion à la fin de la commande ou si erreur
    await client.close();
  }
};
//module.exports.run().catch(console.dir);

//Fonction qui renvoit les deals avec la température la plus haute
module.exports.bestTemperature = async () => {
  try {
    //Ouvre la connexion
    await client.connect();
    const db = client.db("LegoDB");

    const collection = db.collection("deals"); //sera toujours deals lorsque les fonctions concernent les deals dealabs et l'id du set lego pour les sales vinted
    const deals = await collection.find({}).toArray();
    const best = deals.filter((deal) => deal.temperature >= 100);
    console.log(best);
  } finally {
    //Ferme la connexion à la fin de la commande ou si erreur
    await client.close();
  }
};
//module.exports.bestTemperature().catch(console.dir);

//Fonction qui renvoit les deals avec le plus de commentaires
module.exports.mostCommented = async () => {
  try {
    //Ouvre la connexion
    await client.connect();
    const db = client.db("LegoDB");

    const collection = db.collection("deals");
    const deals = await collection.find({}).toArray();
    const best = deals.filter((deal) => deal.commentaire >= 15);
    console.log(best);
  } finally {
    //Ferme la connexion à la fin de la commande ou si erreur
    await client.close();
  }
};
//module.exports.mostCommented().catch(console.dir);

//Fonction qui renvoit les deals avec les meilleures promotions
module.exports.bestPromotion = async () => {
  try {
    //Ouvre la connexion
    await client.connect();
    const db = client.db("LegoDB");

    const collection = db.collection("deals"); 
    const deals = await collection.find({}).toArray();
    const best = deals.filter((deal) => deal.promotion >= 30);
    console.log(best);
  } finally {
    //Ferme la connexion à la fin de la commande ou si erreur
    await client.close();
  }
};
//module.exports.bestPromotion().catch(console.dir);

//Fonction qui renvoit les deals trié du plus récent au plus ancient
module.exports.plusRecent = async () => {
  try {
    // Ouvre la connexion
    await client.connect();
    const db = client.db("LegoDB");

    const collection = db.collection("deals");
    const sortedDeals = await collection.find({}).sort({ publication: -1 }).toArray();

    console.log(sortedDeals);
    return sortedDeals;
  } finally {
    // Ferme la connexion à la fin de la commande ou en cas d'erreur
    await client.close();
  }
};
//module.exports.plusRecent().catch(console.dir);

//Fonction qui renvoit les deals du plus ancien au plus récent
module.exports.plusAncien = async () => {
  try {
    // Ouvre la connexion
    await client.connect();
    const db = client.db("LegoDB");

    const collection = db.collection("deals");
    const sortedDeals = await collection.find({}).sort({ publication: 1 }).toArray();

    console.log(sortedDeals);
    return sortedDeals;
  } finally {
    // Ferme la connexion à la fin de la commande ou en cas d'erreur
    await client.close();
  }
};
//module.exports.plusAncien().catch(console.dir);

//Fonction qui renvoit lesdeals du plus cher au moins cher
module.exports.plusCherAuMoinsCher = async () => {
  try {
    // Ouvre la connexion
    await client.connect();
    const db = client.db("LegoDB");

    const collection = db.collection("deals");
    const sortedDeals = await collection.find({}).sort({ price: -1 }).toArray();

    console.log(sortedDeals);
    return sortedDeals;
  } finally {
    // Ferme la connexion à la fin de la commande ou en cas d'erreur
    await client.close();
  }
};
//module.exports.plusCherAuMoinsCher().catch(console.dir);

//Fonction qui renvoit les deals du moins cher au plus cher
module.exports.moinsCherAuPlusCher = async () => {
  try {
    // Ouvre la connexion
    await client.connect();
    const db = client.db("LegoDB");

    const collection = db.collection("deals");
    const sortedDeals = await collection.find({}).sort({ price: 1 }).toArray();

    console.log(sortedDeals);
    return sortedDeals;
  } finally {
    // Ferme la connexion à la fin de la commande ou en cas d'erreur
    await client.close();
  }
};
//module.exports.moinsCherAuPlusCher().catch(console.dir);
