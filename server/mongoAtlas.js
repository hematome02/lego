//require(`dotenv`).config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
// const uri = `mongodb+srv://emmafromager:${process.env.SECRET_KEY}@lego.tb3vb.mongodb.net/?retryWrites=true&w=majority&appName=Lego`;


// //Crée un client Mongo pour créer la version API stable
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// });

const connectToDatabase = require("./connection/conn.js");

//Fonction de netoyage de la base de donnée
module.exports.mongoClear = async (obj, name) => {
  try {
    //Ouvre la connexion
    //await client.connect();
    const db = await connectToDatabase()//client.db("LegoDB");
    const collections = await db.listCollections().toArray(); // Liste toutes les collections de la base
    for (const collection of collections) {
      await db.collection(collection.name).drop(); // Supprime chaque collection
      console.log(`Collection '${collection.name}' supprimée.`);
    }
  } catch (error) {
    console.error('Erreur lors de la récupération du deal:', error);
    throw error;  // Rethrow l'erreur pour gérer l'erreur ailleurs si nécessaire
  } 
};

//Function d'ajout à la base de donnée des deals et ventes sur Vinted
module.exports.run = async (obj, name) => {
  try {
    //Ouvre la connexion
    // await client.connect();
    const db = await connectToDatabase();//client.db("LegoDB");
    const collection = db.collection(name);
    //await collection.deleteMany({});
    const resultat = await collection.insertMany(obj);
    //console.log(resultat);
  } catch (error) {
    console.error('Erreur lors de la récupération du deal:', error);
    throw error;  // Rethrow l'erreur pour gérer l'erreur ailleurs si nécessaire
  } 
  // } finally {
  //   //Ferme la connexion à la fin de la commande ou si erreur
  //   await client.close();
 // }
};
//module.exports.run().catch(console.dir);

//Fonction qui renvoit les deals avec la température la plus haute
module.exports.bestTemperature = async () => {
  try {
    //Ouvre la connexion
    const db = await connectToDatabase();

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
    const db = await connectToDatabase();

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
    const db = await connectToDatabase();
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
    const db = await connectToDatabase();
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
    const db = await connectToDatabase();

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
    const db = await connectToDatabase();

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
    const db = await connectToDatabase();

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

//Fonction qui renvoit les deals 
module.exports.deal = async () => {
  
    // Ouvre la connexion
    const db = await connectToDatabase();
    const collection = db.collection("deals");
    const sortedDeals = await collection.find({}).sort({ price: 1 }).toArray();

    //console.log(sortedDeals);
    return sortedDeals;
   
};
//module.exports.deal().catch(console.dir);

//Fonction qui renvoit un deal pour un id mongo spécifique
module.exports.dealId = async (dealid) => {
  try {
    // Ouvre la connexion
    //await client.connect();
    const db = await connectToDatabase();//client.db("LegoDB");
    const collection = db.collection("deals");

    // Convertit dealId en ObjectId si ce n'est pas déjà le cas
   const objectId = new ObjectId(dealid);  // Cela garantit que l'ID est de type ObjectId

    // Trouve un deal avec cet ID spécifique
    const deal = await collection.find({ _id: objectId }).toArray();

   //console.log(deal);

    // Si un deal est trouvé, le renvoyer. Sinon, renvoyer null ou une réponse d'erreur.
    return deal || null;  // Retourne null si aucun deal n'a été trouvé avec cet ID

  } catch (error) {
    console.error('Erreur lors de la récupération du deal:', error);
    throw error;  // Rethrow l'erreur pour gérer l'erreur ailleurs si nécessaire
  } 
};
//module.exports.dealId('6742181ffd7308737154b6ea').catch(console.dir);

//Fonction qui renvoi le fichier json de l'Id du set de lego séléctionné 
module.exports.saleId = async (salenamed) => {
  try {
    const db = await connectToDatabase();

    //console.log(" 0" );
    const collection = db.collection(salenamed).find({}).toArray();
    
    return await collection || null;
  }catch (error) {
    console.error('Erreur lors de la récupération du deal:', error);
    throw error; 
  }
}
//module.exports.saleId('71428').catch(console.dir);

// Fonction pour récupérer un document par son numéro de fichier (ex. 71230)

//module.exports.saleId("71428").catch(console.dir);

module.exports.dealPriceId = async (dealid) => {
  try {
    // Connexion à la base de données
    const db = await connectToDatabase();  // Assurez-vous que cette fonction fonctionne correctement
    const collection = db.collection("deals");

    // Vérifier que dealid est bien un string
    if (typeof dealid !== 'string') {
      throw new Error('dealid doit être une chaîne de caractères');
    }
    console.log(dealid);
    dealid=dealid.trim();

    // Trouver un deal avec l'ID spécifique (utiliser findOne pour un seul document)
    const deal = await collection.findOne({ id : dealid });

    // Afficher le deal trouvé pour le débogage
    console.log("Deal trouvé:", deal);

    // Si aucun deal n'est trouvé, retourner null
    if (!deal) {
      console.log(`Aucun deal trouvé pour l'ID: ${dealid}`);
      return null;
    }

    console.log(deal.price);

    // Retourner le prix du deal
    return deal.price || null;

  } catch (error) {
    console.error('Erreur lors de la récupération du prix:', error);
    throw error;  // Relance l'erreur pour gestion ultérieure
  }
};
/*
//Fonction qui renvoit un deal pour un id mongo spécifique
module.exports.dealPriceId = async (dealid) => {
  try {
    // Ouvre la connexion
    //await client.connect();
    const db = await connectToDatabase();//client.db("LegoDB");
    const collection = db.collection("deals");

    //const str = String(dealid);
    //console.log(str);
    //console.log(typeof dealid);

    //Trouve le prix d'un id lego specifique
    const deal =  await collection.find({ id: dealid });
      //{ $expr: { $eq: ["$id", dealid ] } } , { projection: { price: 1, id:1 } }).toArray();

    console.log(dealid);


    // Convertit dealId en ObjectId si ce n'est pas déjà le cas
   //const objectId = new ObjectId(dealid);  // Cela garantit que l'ID est de type ObjectId

    // Trouve un deal avec cet ID spécifique
    //const deal = await collection.find({ _id: objectId }).toArray();

    console.log("deals");
    console.log(deal);

    if(deal===null) return null;

   

    // Si un deal est trouvé, le renvoyer. Sinon, renvoyer null ou une réponse d'erreur.
    return  deal.price || null;  // Retourne null si aucun deal n'a été trouvé avec cet ID

  } catch (error) {
    console.error('Erreur lors de la récupération du deal:', error);
    throw error;  // Rethrow l'erreur pour gérer l'erreur ailleurs si nécessaire
  } 
};*/
//module.exports.dealPriceId("76303").catch(console.dir);
