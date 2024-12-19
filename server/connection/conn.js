require(`dotenv`).config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://emmafromager:${process.env.SECRET_KEY}@lego.tb3vb.mongodb.net/?retryWrites=true&w=majority&appName=Lego`;

let db; // Stocke la connexion globale

async function connectToDatabase() {
    if (db) {
        return db; // Retourne la connexion existante si elle est déjà établie
    }
    try {
        const client = new MongoClient(uri, {
            serverApi: {
              version: ServerApiVersion.v1,
              strict: true,
              deprecationErrors: true,
            },
        });
        await client.connect();
        console.log("Connexion à MongoDB Atlas réussie !");
        db = client.db("LegoDB"); // Nom de votre base de données
        return db;
    } catch (error) {
        console.error("Erreur de connexion à MongoDB :", error);
        process.exit(1);
    }
}

module.exports = connectToDatabase;
