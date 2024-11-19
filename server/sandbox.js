/* eslint-disable no-console, no-process-exit */
const avenuedelabrique = require('./websites/vinted');
const dealabs = require('./websites/dealabs');
const vinted = require('./websites/vinted');
const pagination = require('./websites/nbPageDealabs');
let deals=[];
const fs = require('fs');

async function sandbox (){
  //website = 'https://www.vinted.fr/api/v2/catalog/items?page=1&per_page=96&search_text=76434') {//https://www.dealabs.com/groupe/lego?page=2&hide_expired=true') {
  try {
    console.log(`Scraping en vue ne pas déranger `);//(`🕵️‍♀️  browsing ${website} website`);

    //1er étape : Récuperer le numéro de la derniere page contenant des deals Lego actifs      
    const page = await pagination.scrape("https://www.dealabs.com/groupe/lego?hide_expired=true");
    console.log(page);

    //2eme étape : Scrapper les pages avec des deals Lego actifs
    for(let i=1; i<=page; i++)
    {
      //On récupère les deals de la page i que l'on ajoute au tableau contenant les deals dealabs
      deals = deals.concat(await dealabs.scrape(`https://www.dealabs.com/groupe/lego?page=${i}&hide_expired=true`));
      console.log("Page ", i);      
    }
    //console.log(deals);

    //3eme étape : Transformer le tableau en fichier json 
    fs.writeFileSync("dealabs.json", JSON.stringify(deals, null, 2), 'utf-8');    
    console.log(`Data saved to dealabs.json`);

    //4eme étape : Récuperer les ids des set Lego de dealabs.com 

    //5eme étape : Scrapper les pages avec les ids set Lego sur Vinted

    //6eme étape : Transformer le tableau en fichier json


  /*
    //nous avons créer un tableau dans lequel nous allons récuperer les Ids des set Lego pour aller sur Vinted 

    const dlabs=await dealabs.scrape("https://www.dealabs.com/groupe/lego?page=2&hide_expired=true","dealabs.json");

    //console.log(deals);
    
    // deals= deals.concat (valeur concat) pour récupérer le tableau de lego id 
    
    console.log(deals);
    deals= await vinted.scrape(website,"vinted.json");

    console.log(await vinted.scrape(website,"vinted.json"));
    console.log("In sandbox ");
    console.log(deals);*/
    
    console.log('done');
  
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

const [,, eshop] = process.argv;

sandbox(eshop);
