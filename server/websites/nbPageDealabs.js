const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));
  const cheerio = require('cheerio');

  //Récupérer la derniere page ayant des deals Lego actifs  
  const parse= data =>{
    const $ = cheerio.load(data );
    let lastPage;
    // Parcourir toutes les balises <script> et chercher celle contenant /window.__INITIAL_STATE__ puis récuperer l'information de la derniere page
    $('script').each((i, el) => {
        const scriptContent = $(el).html();
        const match = scriptContent.match(/window.__INITIAL_STATE__\s=\s({.*?});/s);
        if (match && match[1]) {            
            const data = JSON.parse(match[1]);
            lastPage = data.pagination.lastPage;
        }
    });    
    //console.log("Dernière page :", lastPage); 
    return lastPage;     
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
      console.log(`Data Page accessed`);
      const page = parse(body);
      //console.log(page);
      return page;
    }
      
    console.error(`Request failed with status ${response.status}`);
    return null;
  };
  