/* eslint-disable no-console, no-process-exit */
const avenuedelabrique = require("./websites/vinted");
const dealabs = require("./websites/dealabs");
const vinted = require("./websites/vinted");
const pagination = require("./websites/nbPageDealabs");

const fs = require("fs");
const mongo = require("./mongoAtlas");

async function sandbox() {
  //website = 'https://www.vinted.fr/api/v2/catalog/items?page=1&per_page=96&search_text=76434') {//https://www.dealabs.com/groupe/lego?page=2&hide_expired=true') {
  try {
    //Etape préparatoire : suppression des bases de données existantes afin de ne pas stocker des set d'id Lego qui n'ont pas d'offres dealabs.
    mongo.mongoClear();

    console.log(`🕵️‍♀️ Scraping en vue ne pas déranger `); //(`🕵️‍♀️  browsing ${website} website`);
    let deals = [];

    //1er étape : Récuperer le numéro de la derniere page contenant des deals Lego actifs
    const page = await pagination.scrape(
      "https://www.dealabs.com/groupe/lego?hide_expired=true"
    );
    console.log(page);

    //2eme étape : Scrapper les pages avec des deals Lego actifs
    for (let i = 1; i <= page; i++) {
      //On récupère les deals de la page i que l'on ajoute au tableau contenant les deals dealabs
      deals = deals.concat(
        await dealabs.scrape(
          `https://www.dealabs.com/groupe/lego?page=${i}&hide_expired=true`
        )
      );
      console.log("Page ", i);
    }
    //console.log(deals);

    //3eme étape : Transformer le tableau en fichier json
    fs.writeFileSync("dealabs.json", JSON.stringify(deals, null, 2), "utf-8");
    console.log(`Data saved to dealabs.json`);

    //3eme étape bis : Sauvegarde sur Mongo des deals
    await mongo.run(deals, "deals");
    console.log("Les deals ont été enregistrés");

    //4eme étape : Récuperer les ids des set Lego de dealabs.com
    const iddeal = new Set(deals.map((deal) => deal.id));
    console.log("Length table avec les ids", deals.length);
    console.log("4eme étape", iddeal);

    //5eme étape : Scrapper les pages avec les ids set Lego sur Vinted
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    for (const id of iddeal) {
      const temp = await vinted.scrape(
        `https://www.vinted.fr/api/v2/catalog/items?page=1&per_page=96&search_text=${id}&catalog_ids=&size_ids=&brand_ids=89162&status_ids=&material_ids=`
      );
      //6eme étape : Transformer le tableau en fichier json
      //un fichier json par id set Lego qui nenvoit des offres Vinted

      if (temp != null) {
        console.log(temp.length);
        if (temp.length > 0) {
            fs.writeFileSync(
              `Vinted/${id}.json`,
              JSON.stringify(temp, null, 2),
              "utf-8"
            );
            console.log(`Data saved to ${id}.json`);
            await mongo.run(temp, `${id}`);
            console.log(`${id} ont été enregistrés sur MongoDB Atlas`);
        }else {
          console.log("id de set Lego non vendu sur Vinted", id);
          fs.writeFileSync(
            `Vinted/Non existant ${id}.json`,
            JSON.stringify(temp, null, 2),
            "utf-8"
          );
          console.log(`Data saved to ${id}.json`);
        }


      // console.log(temp.length);
      // console.log(temp != null);
      // if (temp.length > 0) {
      //   fs.writeFileSync(
      //     `Vinted/${id}.json`,
      //     JSON.stringify(temp, null, 2),
      //     "utf-8"
      //   );
      //   console.log(`Data saved to ${id}.json`);
      //   await mongo.run(temp, `${id}`);
      //   console.log(`${id} ont été enregistrés sur MongoDB Atlas`);
      // } else {
      //   console.log("id de set Lego non vendu sur Vinted", id);
      //   fs.writeFileSync(
      //     `Vinted/Non existant ${id}.json`,
      //     JSON.stringify(temp, null, 2),
      //     "utf-8"
      //   );
      //   console.log(`Data saved to ${id}.json`);
      }

      await delay(1000);
    }

    console.log("done");

    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

const [, , eshop] = process.argv;

sandbox(eshop);
