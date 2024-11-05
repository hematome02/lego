const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const cheerio = require('cheerio');
const fs = require('fs');

/**
 * Parse webpage data response
 * @param  {String} data - html response
 * @return {Object} deal
 */
const parse = data => {
  const $ = cheerio.load(data, {'xmlMode': true});

  return $('div.prods a')
    .map((i, element) => {
      const price = parseFloat(
        $(element)
          .find('span.prodl-prix span')
          .text()
      );

      const discount = Math.abs(parseInt(
        $(element)
          .find('span.prodl-reduc')
          .text()
      ));

      return {
        discount,
        price,
        'title': $(element).attr('title'),
        
      };
    })
    .get();
    
};

/**
 * Scrape a given url page
 * @param {String} url - url to parse
 * @param {String} outputFile - path to the output JSON file
 * @returns 
 */
module.exports.scrape = async (url,outputFile) => {
  const response = await fetch(url);
  
  if (response.ok) {
    const body = await response.text();
    console.log(`Data accessed`);
    const parsedData = parse(body);
       
    fs.writeFileSync(outputFile, JSON.stringify(parsedData, null, 2), 'utf-8');
    console.log(`Data saved to ${outputFile}`);
   
   return parse(body);
  }

  console.error(response);
  

  return null;
};