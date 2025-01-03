const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));
  const cheerio = require('cheerio');
  
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

        //Instanciation des variables à récupérer

        //Dans le premier dataset
        var id=null;   //du set de lego
        var tempid = null;  
        var title="";    
        var temperature=0;
        var publication="";
        var price=0;
        var reduction=0;        
        var datefin="";//vérifie que le deal n'est pas expiré
        var link="";
        let discount = 0;
        let comments=-1;

        //Dans le deuxieme dataset
        var threadId=0;
        var photo="";

        if (dataVue2Content) {
          try {
            const data = JSON.parse(dataVue2Content); // Convertit la chaîne JSON en objet
            //console.log(data); // Affiche l'objet JSON dans la console

            //console.log(data.props.thread.temperature);
            temperature=data.props.thread.temperature;                    
            //console.log(new Date(data.props.thread.publishedAt*1000).toLocaleDateString());
            publication=new Date(data.props.thread.publishedAt*1000).toLocaleDateString();                    
            //console.log(data.props.thread.price);
            price= data.props.thread.price;
            //console.log(data.props.thread.nextBestPrice);
            reduction=data.props.thread.nextBestPrice;
            //console.log(data.props.thread.link);
            link = data.props.thread.link;
            datefin=data.props.thread.isExpired;
            //console.log(data.props.thread.commentCount);
            comments=data.props.thread.commentCount
            //console.log(data.props.thread.title);
            title=data.props.thread.title;
            tempid=title.match(/\d{4,5}/);
            if(tempid ){id=tempid[0];}
          } catch (error) { console.error("Erreur lors du parsing du JSON :", error); }
        } else {console.error("L'attribut data-vue2 est vide ou introuvable.");}
                            
        if (recuperationImage) {
          try {
            const data = JSON.parse(recuperationImage); // Convertit la chaîne JSON en objet
            //console.log(data); // Affiche l'objet JSON dans la console
                   
            // console.log(data.props.threadId);
            threadId=data.props.threadId;
            //console.log(data.props.threadImageUrl);
            photo=data.props.threadImageUrl;                   
          } catch (error) { console.error("Erreur lors du parsing du JSON :", error); }
        } else { console.error("L'attribut recuperationimage est vide ou introuvable.");}

        //On ne souhaite récuperer que des deals de set de Lego, il faiut donc éliminer tout les deals n'ayant pas d'id de set de Lego
        //On va d'abord vérifer que les deals sont toujours actifs en regardant leur status/datefin

        if (datefin == false && id !== null){
          return {
            threadId,
            photo,
            id,
            title, 
            temperature,
            publication,
            price,
            reduction,
            discount: (price !== 0 && reduction !== 0) ? 100-(Math.round((price / reduction) * 100)) : 0 ,           
            link,
            datefin, 
            comments,
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

module.exports.scrape = async (url) => {
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
    console.log(`Dealabs Data accessed`);
    //const parsedData = parse(body);      
    return parse(body);
  }

  console.error(`Request failed with status ${response.status}`);
  return null;
};
