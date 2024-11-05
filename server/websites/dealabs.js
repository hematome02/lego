const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));
  const cheerio = require('cheerio');
  const fs = require('fs');

  /**
   * Parse webpage data response
   * @param  {String} data - html response
   * @return {Object} deal
   */
  const parse = data => {
    const $ = cheerio.load(data, {'xmlMode': true});
  
    return $('article')
      .map((i, element) => {

        //Récupération des données pour chaque set de lego
        const dataVue2Content = $(element).find("div").attr("data-vue2");
        //console.log(dataVue2Content);

        //Récupération des images 
        const recuperationImage=$(element).find("div.threadGrid div div").attr("data-vue2");
        //console.log(recuperationImage);

        //Instanciation des variables récupérées

        //dans le premier dataset
        var id=0;   //du set de lego
        var tempid=0;  
        var titre="";    
        var temperature=0;
        var publication="";
        var price=0;
        var reduction=0;        
        var datefin="";//vérifie que le deal n'est pas expiré
        var link="";

        //dans le deuxieme dataset
        var threadId=0;
        var image= "";

        if (dataVue2Content) {
             try {
                    const data = JSON.parse(dataVue2Content); // Convertit la chaîne JSON en objet
                    //console.log(data); // Affiche l'objet JSON dans la console

                    //console.log(data.props.thread.temperature);
                    temperature=data.props.thread.temperature;
                    //console.log(data.props.thread.publishedAt);
                    publication=new Date(data.props.thread.publishedAt*1000).toLocaleDateString();
                    //console.log(new Date(data.props.thread.publishedAt*1000).toLocaleDateString());
                    //console.log(data.props.thread.price);
                    price= data.props.thread.price;
                    //console.log(data.props.thread.nextBestPrice);
                    reduction=data.props.thread.nextBestPrice;
                    //console.log(data.props.thread.link);
                    link = data.props.thread.link;
                    datefin=data.props.thread.isExpired;
                    //console.log(data.props.thread.title);
                    titre=data.props.thread.title;
                    tempid=titre.match(/\d{4,5}/);
                    id=tempid[0];

                } catch (error) { console.error("Erreur lors du parsing du JSON :", error); }
        } else {console.error("L'attribut data-vue2 est vide ou introuvable.");}
                            
        if (recuperationImage) {
            try {
                   const data = JSON.parse(recuperationImage); // Convertit la chaîne JSON en objet
                   //console.log(data); // Affiche l'objet JSON dans la console
                   
                   // console.log(data.props.threadId);
                   threadId=data.props.threadId;
                   //console.log(data.props.threadImageUrl);
                   image=data.props.threadImageUrl;                   
                 } catch (error) { console.error("Erreur lors du parsing du JSON :", error); }
       } else { console.error("L'attribut recuperationimage est vide ou introuvable.");}
    
    //on ne souhaite voir dans notre fichier que les deals actifs
       if (datefin == false ){
        return {
            threadId,
            image,
            id,
            titre, 
            temperature,
            publication,
            price,
            reduction,
            promotion: (price !== 0 && reduction !== 0) ? `${100-(Math.round((price / reduction) * 100))} %`: `${0} %`,           
            link,
            datefin
        };

       }
        
      })
      .get();
      
    };

  /**
 * Scrape a given url page
 * @param {String} url - url to parse
 * @returns 
 */

module.exports.scrape = async (url,outputFile) => {
  const response = await fetch(url, {
    method: 'GET', // Optionnel, car GET est le comportement par défaut
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      // Ajoutez d'autres headers ici si nécessaire
    },
  });

  if (response.ok) {
    const body = await response.text();
    console.log(`Data accessed`);
    const parsedData = parse(body);
    
    fs.writeFileSync(outputFile, JSON.stringify(parsedData, null, 2), 'utf-8');
    console.log(`Data saved to ${outputFile}`);
    return parse(body);
  }

  console.error(`Request failed with status ${response.status}`);
  return null;
};
