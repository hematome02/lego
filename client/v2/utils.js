// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';


/**
 * 
 * @param {Array} deals - list of deals
 * @returns {Array} list of lego set ids
 */
const getIdsFromDeals = deals => {
    return deals.map(deal => deal.id)
}

const getBestDiscount = deals => {
    return deals.filter(deal => deal.discount > 50)
}

const getMostCommented = deals => {
    return deals.filter(deal => deal.comments > 15)
}

const getHotDeals = deals => {
    return deals.filter(deal => deal.temperature > 100)
}

const getFinalDeals = (deals) => {
    deals = deals.result
    if(document.getElementById('bestDiscount').checked) {
        deals = getBestDiscount(deals)
    }
    if(document.getElementById('mostCommented').checked) {
        deals = getMostCommented(deals)
    }
    if(document.getElementById('hotDeals').checked) {
        deals = getHotDeals(deals)
    }
    return deals
}

function SortedByPrice (deals,order) {
    if (order == 'price-asc')
    {
        return deals.sort((a, b) => a.price - b.price);
    }
    else 
    {
        return deals.sort((a, b) => b.price - a.price);

    }
    
}

function SortedByDate (deals,orders) {
    if (orders == 'date-asc')
    {
        return deals.sort((a,b) => new Date(a.published) - new Date(b.published));         
    }
    else 
    {
        return deals.sort((a,b) => new Date(b.published) - new Date(a.published)); 
    }
    
}


function calculatePercentile(prices, percentile) {
  /*  const prices =0
    for( let i=0; i < prices.length; i++)
    {
        cons

    }*/
     
    const index = (percentile / 100) * (prices.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index - lower;
    return prices[lower] + weight * (prices[upper] - prices[lower]);
  }

  function numPercentile(a, p) {
    var q = JSON.parse(JSON.stringify(a)).sort(function(x, y) {
          return x-y;
        }),
        r = (q.length-1) * p,
        b = Math.floor(r);
    return ((q[b+1] !== undefined) ? (q[b] + (r-b) * (q[b+1] - q[b])) : q[b]);
  }