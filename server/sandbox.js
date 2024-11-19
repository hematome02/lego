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
    let iddeal=[];
    console.log("Length table avec les ids", deals.length);

    for(let i=0; i <deals.length; i++){ //remplacer 10 par deals.length lorsque cela fonctionne
      iddeal=iddeal.concat(deals[i].id);
    }
    console.log("4eme etape ", iddeal);

    //5eme étape : Scrapper les pages avec les ids set Lego sur Vinted
    console.log("5eme etape", iddeal.length);//taille du tableau contenant les id des set lego

    for(let i=0; i< iddeal.length; i++){
      let temp= await vinted.scrape(`https://www.vinted.fr/api/v2/catalog/items?page=1&per_page=96&search_text=${iddeal[i]}&catalog_ids=&size_ids=&brand_ids=89162&status_ids=&material_ids=`);
       //6eme étape : Transformer le tableau en fichier json
       // un fichier json par id set Lego qui nenvoit des offres Vinted
      console.log(temp.length);
      console.log(temp!=null);
      if(temp.length >0 ){
      fs.writeFileSync(`Vinted/${iddeal[i]}.json`, JSON.stringify(temp, null, 2), 'utf-8');    
      console.log(`Data saved to ${iddeal[i]}.json`);
      }
      else {
        console.log("id de set Lego non vendu sur Vinted",iddeal[i])
        fs.writeFileSync(`Vinted/Non existant ${iddeal[i]}.json`, JSON.stringify(temp, null, 2), 'utf-8');
        console.log(`Data saved to ${iddeal[i]}.json`);
      }
      
      
    }
       
    console.log('done');
  
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

const [,, eshop] = process.argv;

sandbox(eshop);
