// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

/**
Description of the available api
GET https://lego-api-blue.vercel.app/deals

Search for specific deals

This endpoint accepts the following optional query string parameters:

- `page` - page of deals to return
- `size` - number of deals to return

GET https://lego-api-blue.vercel.app/sales

Search for current Vinted sales for a given lego set id

This endpoint accepts the following optional query string parameters:

- `id` - lego set id to return
*/

// current deals on the page
let currentDeals = [];
let currentPagination = {};
let currentDealsVinted = [];


// instantiate the selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const selectLegoSetIds = document.querySelector('#lego-set-id-select');
const sectionDeals= document.querySelector('#deals');
const spanNbDeals = document.querySelector('#nbDeals');
const selectSort = document.querySelector('#sort-select');
const sectionVinted= document.querySelector('#vinted');
const spanNbSales = document.querySelector('#nbSales');
const spanp5 = document.querySelector('#p5');
const spanp25 = document.querySelector('#p25');
const spanp50 = document.querySelector('#p50');
const lifetime = document.querySelector('lifetimevalue');


/**
 * Set global value
 * @param {Array} result - deals to display
 * @param {Object} meta - pagination meta info
 */
const setCurrentDeals = ({result, meta}) => {
  currentDeals = result;
  currentPagination = meta;
};

/**
 * Fetch deals from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @return {Object}
 */
const fetchDeals = async (page = 1, size = 6
) => {
  try {
    const response = await fetch(
      `https://lego-api-blue.vercel.app/deals?page=${page}&size=${size}`
    );
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return {currentDeals, currentPagination};
    }

    return body.data;
  } catch (error) {
    console.error(error);
    return {currentDeals, currentPagination};
  }
};

const fetchVinted = async (id 
) => {
  try {
    const response = await fetch(
      `https://lego-api-blue.vercel.app/sales?id=${id}`
    );
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return null;
    }

    return body.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};


/**
 * Render list of deals
 * @param  {Array} deals
 * @param  {Array} dealvinteds
 */
const renderDeals = deals => {
  let template = '';
  if(!deals.length) {
    template = `
      <tr>
        <td colspan="5" class="text-center">No deals found</td>
      </tr>
    `;
  }else{
    template = deals
        .map(deal => {
          return `
        <tr id="${deal.uuid}">
          <td>${deal.id}</td>
          <td><img src="${deal.photo}" class="img-fluid img-thumbnail img-max" alt="${deal.title}"></td>
          <td>
            <a href="${deal.link}" target="_blank">${deal.title}</a>
          </td>
          <td>
            ${deal.price}€
            <br>
            <span class="badge text-bg-danger">${deal.discount}%</span>
          </td>
          <td>
            Nombre de commentaires : ${deal.comments}
            <br>
            Température : ${deal.temperature}
          </td>
        </tr>
    `;
        })
        .join('');
  }

  document.querySelector('#deals-table').innerHTML = template;
};

const renderVinted = dealvinteds => {
  let template = '';
  if(!dealvinteds.length) {
    template = `
      <tr>
        <td colspan="3" class="text-center">No vinted found</td>
      </tr>
    `;
  }else{
    template = dealvinteds
        .map(dealvinted => {
          return `
        <tr id="${dealvinted.uuid}">
          <td>
            <a href="${dealvinted.link}" target="_blank">${dealvinted.title}</a>
          </td>
          <td>
            ${dealvinted.price}€
          </td>
          <td>
            ${new Date(dealvinted.published*1000).toLocaleDateString()}
          </td>
        </tr>
    `;
        })
        .join('');
  }

  document.querySelector('#vinted-table').innerHTML = template;
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderPagination = pagination => {
  const {currentPage, pageCount} = pagination;
  const options = Array.from(
    {'length': pageCount},
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');

  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;
};

/**
 * Render lego set ids selector
 * @param  {Array} lego set ids
 */
const renderLegoSetIds = deals => {
  const ids = getIdsFromDeals(deals);
  let options = '<option value="">Select a lego id</option>';
  options += ids.map(id =>
    `<option value="${id}">${id}</option>`
  ).join('');

  selectLegoSetIds.innerHTML = options;
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderIndicators = pagination => {
  const {count} = pagination;
  
  spanNbDeals.innerHTML = count;
  
};

const render = (deals, pagination) => {
  renderDeals(deals);
  renderPagination(pagination);
  renderIndicators(pagination);
  renderLegoSetIds(deals)
  
};

/**
 * Declaration of all Listeners
 */

/**
 * Select the number of deals to display
 */

selectShow.addEventListener('change', async (event) => {
  const deals = await fetchDeals(currentPagination.currentPage, parseInt(event.target.value));

  setCurrentDeals(deals);
  render(currentDeals, currentPagination);
});

document.addEventListener('DOMContentLoaded', async () => {
  const deals = await fetchDeals();

  setCurrentDeals(deals);
  render(currentDeals, currentPagination);
});

selectPage.addEventListener('change', async (event) => {
  const deals = await fetchDeals( parseInt(event.target.value),parseInt(selectShow.value));

  setCurrentDeals(deals);
  render(currentDeals, currentPagination);
});
selectPage.addEventListener('change', async (event) => {
  const deals = await fetchDeals( parseInt(event.target.value),parseInt(selectShow.value));

  setCurrentDeals({result: getFinalDeals(deals), meta: deals.meta});
  render(currentDeals, currentPagination);
});

document.querySelectorAll('#bestDiscount, #mostCommented, #hotDeals').forEach(item =>
    item.addEventListener('change', async (event) => {
      const deals = await fetchDeals(currentPagination.currentPage, parseInt(selectShow.value));

      setCurrentDeals({result: getFinalDeals(deals), meta: deals.meta});

      render(currentDeals, currentPagination);
    })
);

selectSort.addEventListener('change', async (event) => {
  const sort = event.target.value;
  switch (sort) {
    case "price-asc" : 
    currentDeals = SortedByPrice(currentDeals,sort);
    break; 

    case "price-desc" : 
    currentDeals = SortedByPrice(currentDeals,sort);
    break; 

    case "date-desc" :
    currentDeals = SortedByDate(currentDeals,sort);
    break;

    case "date-asc" :
    currentDeals = SortedByDate(currentDeals,sort);
    break;    
  }   

  render(currentDeals, currentPagination);
});

selectLegoSetIds.addEventListener('change', async (event) => {
  
  const dealvinteds = await fetchVinted(selectLegoSetIds.value);
  
  spanNbSales.innerHTML = dealvinteds.result.length;
  
  //je recupere l'id du set lego

  const id= selectLegoSetIds.value; 
 
  //je recupere les ventes vinted pour cet id

  const response = await fetchVinted(selectLegoSetIds.value);
  const sales = response.result;
  
  //je parcours le tableau des ventes vinted et e résupere le prix 
  
  const prices = [];

  for (let i=0; i< sales.length; i++)
  {
    prices.push(sales[i].price); 
    
  }
  spanp5.innerHTML= parseFloat(numPercentile (prices, 0.05)).toFixed(2); 
  spanp25.innerHTML= parseFloat(numPercentile (prices, 0.25)).toFixed(2);
  spanp50.innerHTML= parseFloat(numPercentile (prices, 0.50)).toFixed(2);

  //je cherche la date de la vente la plus ancienne
  let life =0 ;  

  console.log(life);
  console.log(sales);
  for (let i=0; i< sales.length; i++)
  {
    const temp= new Date(sales[i].published )
    console.log(temp);
    if ( sales[i].published - life > 0)  
      life = sales[i].published;
      console.log(life);
      
    
  }
  console.log("2e");
  console.log(Date(life));



  renderVinted(dealvinteds.result);
});


const dealsContent = document.getElementById("dealsContent");
const iconChevron = document.getElementById("icon-chevron");

dealsContent.addEventListener("shown.bs.collapse", function () {
  iconChevron.classList.remove("bi-chevron-right");
  iconChevron.classList.add("bi-chevron-down");
});

dealsContent.addEventListener("hidden.bs.collapse", function () {
  iconChevron.classList.remove("bi-chevron-down");
  iconChevron.classList.add("bi-chevron-right");
});