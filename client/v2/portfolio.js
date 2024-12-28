// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
"use strict";

/**
Description of the available api
GET ${url}/deals

Search for specific deals

This endpoint accepts the following optional query string parameters:

- `page` - page of deals to return
- `size` - number of deals to return

GET ${url}/sales

Search for current Vinted sales for a given lego set id

This endpoint accepts the following optional query string parameters:

- `id` - lego set id to return
*/

// current deals on the page
let currentDeals = [];
let currentPagination = {};
let currentDealsVinted = [];
let favoriteDeals = localStorage.getItem("favoriteDeals")
  ? JSON.parse(localStorage.getItem("favoriteDeals"))
  : [];

let prixIdDealalbs = [];

const url = "https://api-emma.romainpathe.com";
//const url = "https://lego-api-blue.vercel.app";
//http://localhost:8092/deals/?page=1&size=6

// instantiate the selectors
const selectShow = document.querySelector("#show-select");
const selectPage = document.querySelector("#page-select");
const selectLegoSetIds = document.querySelector("#lego-set-id-select");
const sectionDeals = document.querySelector("#deals");
const spanNbDeals = document.querySelector("#nbDeals");
const selectSort = document.querySelector("#sort-select");
const sectionVinted = document.querySelector("#vinted");
const spanNbSales = document.querySelector("#nbSales");
const spanp5 = document.querySelector("#p5");
const spanp25 = document.querySelector("#p25");
const spanp50 = document.querySelector("#p50");
const lifetime = document.querySelector("#lifetimevalue");
const goodBad = document.querySelector("#valeur-deal");

/**
 * Set global value
 * @param {Array} result - deals to display
 * @param {Object} meta - pagination meta info
 */
const setCurrentDeals = ({ result, meta }) => {
  currentDeals = result;
  currentPagination = meta;
};

/**
 * Fetch deals from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @return {Object}
 */
const fetchDeals = async (page = 1, size = 6) => {
  try {
    const response = await fetch(`${url}/deals?page=${page}&size=${size}`);
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return { currentDeals, currentPagination };
    }

    return body.data;
  } catch (error) {
    console.error(error);
    return { currentDeals, currentPagination };
  }
};

const fetchVinted = async (id) => {
  try {
    const response = await fetch(`${url}/sales/${id}`);
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return null;
    }

    console.log(body);

    return body.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

/**
 * Render list of deals
 * @param  {Array} deals
 * @param table
 */
const renderDeals = (deals, table = "deals") => {
  let template = "";
  if (!deals.length) {
    template = `
      <tr>
        <td colspan="5" class="text-center">No ${
          table === "deals" ? "deals" : "favorites"
        } found</td>
      </tr>
    `;
  } else {
    template = deals
      .map((deal) => {
        prixIdDealalbs.push({ id: deal.id, price: deal.price });
        return `
        <tr id="${deal.threadId}">
          <td>
            ${deal.id}
            <br>
            <span class="badge rounded-pill text-bg-${
              favoriteDeals.some((favDeal) => favDeal.id === deal.id)
                ? "warning remove-favorite"
                : "success add-favorite"
            }"
            data-id="${deal.id}">
              Favorite
            </span>
          </td>
          <td><img src="${
            deal.photo
          }" class="img-fluid img-thumbnail img-max" alt="${deal.title}"></td>
          <td>
            <a href="${deal.link}" target="_blank">${deal.title}</a>
          </td>
          <td>
            ${deal.price}€    
            <br>
            <s>${deal.reduction}€</s>        
            <br>
            <span class="badge rounded-pill bg-info text-dark">${
              deal.discount
            }%</span>
          </td>
          <td>
            Number of comments : ${deal.comments}
            <br>
            <span class="badge rounded-pill bg-danger">${
              deal.temperature
            }°</span> 
        </tr>
    `;
      })
      .join("");
  }

  document.querySelector("#" + table + "-table").innerHTML = template;
};

const renderVinted = (dealvinteds) => {
  let template = "";
  if (!dealvinteds.length) {
    template = `
      <tr>
        <td colspan="4" class="text-center">No Vinted sales found</td>
      </tr>
    `;
  } else {
    template = dealvinteds
      .map((dealvinted) => {
        return `
        <tr id="${dealvinted._id}">
          <td>
            <a href="${dealvinted.lienURL}" target="_blank">${dealvinted.titre}</a>
          </td>
          <td>
            ${dealvinted.price} €
          </td>
          <td>
           ${dealvinted.image}
          </td>
          <td>
           ${dealvinted.favourite}
          </td>

        </tr>
    `;
      })
      .join("");
  }

  document.querySelector("#vinted-table").innerHTML = template;
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderPagination = (pagination) => {
  const { currentPage, pageCount } = pagination;
  const options = Array.from(
    { length: pageCount },
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join("");

  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;
};

/**
 * Render lego set ids selector
 * @param  {Array} lego set ids
 */
const renderLegoSetIds = (deals) => {
  const ids = getIdsFromDeals(deals);
  let options = '<option value="">Select a Lego Id</option>';
  options += ids.map((id) => `<option value="${id}">${id}</option>`).join("");

  selectLegoSetIds.innerHTML = options;
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderIndicators = (pagination) => {
  const { count } = pagination;

  spanNbDeals.innerHTML = count;
};

const render = (deals, pagination) => {
  console.log("deals");
  renderDeals(deals);
  console.log("ok");
  renderPagination(pagination);
  renderIndicators(pagination);
  renderLegoSetIds(deals);
};

/**
 * Declaration of all Listeners
 */

/**
 * Select the number of deals to display
 */

selectShow.addEventListener("change", async (event) => {
  const deals = await fetchDeals(
    currentPagination.currentPage,
    parseInt(event.target.value)
  );

  setCurrentDeals(deals);
  render(currentDeals, currentPagination);
});

document.addEventListener("DOMContentLoaded", async () => {
  const deals = await fetchDeals();

  setCurrentDeals(deals);
  render(currentDeals, currentPagination);
});

selectPage.addEventListener("change", async (event) => {
  const deals = await fetchDeals(
    parseInt(event.target.value),
    parseInt(selectShow.value)
  );

  setCurrentDeals(deals);
  render(currentDeals, currentPagination);
});
selectPage.addEventListener("change", async (event) => {
  const deals = await fetchDeals(
    parseInt(event.target.value),
    parseInt(selectShow.value)
  );

  setCurrentDeals({ result: getFinalDeals(deals), meta: deals.meta });
  render(currentDeals, currentPagination);
});

document
  .querySelectorAll("#bestDiscount, #mostCommented, #hotDeals")
  .forEach((item) =>
    item.addEventListener("change", async (event) => {
      const deals = await fetchDeals(
        currentPagination.currentPage,
        parseInt(selectShow.value)
      );

      setCurrentDeals({ result: getFinalDeals(deals), meta: deals.meta });

      render(currentDeals, currentPagination);
    })
  );

selectSort.addEventListener("change", async (event) => {
  const sort = event.target.value;
  switch (sort) {
    case "price-asc":
      currentDeals = SortedByPrice(currentDeals, sort);
      break;

    case "price-desc":
      currentDeals = SortedByPrice(currentDeals, sort);
      break;

    case "date-desc":
      currentDeals = SortedByDate(currentDeals, sort);
      break;

    case "date-asc":
      currentDeals = SortedByDate(currentDeals, sort);
      break;
  }

  render(currentDeals, currentPagination);
});

selectLegoSetIds.addEventListener("change", async (event) => {
  const dealvinteds = await fetchVinted(selectLegoSetIds.value);
  spanNbSales.innerHTML = dealvinteds.result.length;

  //je recupere l'id du set lego

  const id = selectLegoSetIds.value;

  //je recupere les ventes vinted pour cet id

  const response = await fetchVinted(selectLegoSetIds.value);
  const sales = response.result;
  //console.log(sales);
  //je parcours le tableau des ventes vinted et je résupere le prix

  const prices = [];

  for (let i = 0; i < sales.length; i++) {
    prices.push(sales[i].price);
  }
  spanp5.innerHTML = parseFloat(numPercentile(prices, 0.05)).toFixed(2) + " €";
  spanp25.innerHTML = parseFloat(numPercentile(prices, 0.25)).toFixed(2) + " €";
  spanp50.innerHTML = parseFloat(numPercentile(prices, 0.5)).toFixed(2) + " €";

  //je cherche la date de la vente la plus ancienne

  //je cherche la date d'aujourd'hui
  let aujourd = new Date();
  let day = aujourd.getDate();
  let month = aujourd.getMonth() + 1;
  let year = aujourd.getFullYear();

  // on ajoute un peu de formatage
  day = day < 10 ? "0" + day : day;
  month = month < 10 ? "0" + month : month;

  //la date d'aujourd'hui est hui
  let hui = new Date(year, month - 1, day).toLocaleDateString();

  let an = -1;
  let mo = -1;
  let jour = -1;

  let ana = -1;
  let moi = -1;
  let jours = -1;

  for (let i = 0; i < sales.length; i++) {
    const temp = sales[i].image;

    //console.log("annee", year-temp.slice(6,10));
    an = year - temp.slice(6, 10);

    //console.log("mois",temp.slice(3,5)-month);
    mo = Math.abs(temp.slice(3, 5) - month);

    //console.log("jour",temp.slice(0,2)-day);
    jour = 0;
    //console.log(temp.slice(0,2)>=day);
    if (temp.slice(0, 2) <= day) {
      jour = Math.abs(temp.slice(0, 2) - day);
      jour += 1;
    } else {
      mo -= 1;
      const moisJour = [
        { mois: 1, jours: 31 }, // Janvier
        { mois: 2, jours: 28 }, // Février
        { mois: 3, jours: 31 }, // Mars
        { mois: 4, jours: 30 }, // Avril
        { mois: 5, jours: 31 }, // Mai
        { mois: 6, jours: 30 }, // Juin
        { mois: 7, jours: 31 }, // Juillet
        { mois: 8, jours: 31 }, // Août
        { mois: 9, jours: 30 }, // Septembre
        { mois: 10, jours: 31 }, // Octobre
        { mois: 11, jours: 30 }, // Novembre
        { mois: 12, jours: 31 }, // Décembre
      ];

      //console.log("test",moisJour.find(m => m.mois === month));
      //console.log((moisJour.find(m => m.mois === month)).jours);
      jour = Math.abs(
        moisJour.find((m) => m.mois === month).jours -
          (temp.slice(0, 2) - day) +
          2
      );
    }

    //console.log("diff year", temp.slice(6,10)==year)
    if (temp.slice(6, 10) != year) {
      mo = month;
      jour = day;
    }

    //console.log(ana, moi, jours);
    //console.log(an,mo, jour);

    if (ana <= an) {
      ana = an;
      if (moi <= mo) {
        moi = mo;
        jours = jour;
      } else {
        if (jours < jour) {
          jours = jour;
        }
      }
    }
  }

  lifetime.innerHTML = `${ana} an, ${moi} mois, ${jours} jour(s)`;

  //Fonction pour savoir si c'est un bon deal

  let texteGoodBad = "";
  //combien de sales existantes et depuis combien de temps ces sales sont présents
  
  const result = prixIdDealalbs.find((deal) => deal.id === id);

  // Si un deal est trouvé, vous pouvez accéder à la propriété price
  if (result) {
    console.log(result.price); // Affiche uniquement le prix
  } else {
    console.log("Deal non trouvé");
  }

  console.log(spanp25.innerHTML >= result.price);

  //Premiere étape que faire si pas de sales lego
  if (ana == -1) {
    texteGoodBad = "There is no history on Vinted for this Lego Id ";
  } else {
    if (spanNbSales.innerHTML > 10) {
      if (ana > 0) {
        texteGoodBad =
          "Bad Deals. There is already some offers on Vinted and they have been there for a while.";
      } else {
        //ana <= 0
        if (moi > 6) {
          texteGoodBad =
            "Bad Deals. There is already some offers on Vinted and they have been there for a while.";
        } else {
          texteGoodBad =
            "Bad Deals. The plethora of offers haven't been here for a while but they didn't sale.";
        }
      }
    } //spanNbSales.innerHTML <=10
    else {
      if (ana > 0) {
        texteGoodBad =
          "Bad Deals. There is not a lot of offers on Vinted but they have been there for a while.";
      } else {
        //ana <= 0
        if (moi > 6) {
          texteGoodBad =
            "Bad Deals. There is not a lot of offers on Vinted but they have been there for a while.";
        } else {
          console.log(parseFloat(spanp50.innerHTML));
          console.log(spanp50.innerHTML);

          console.log(result.price / parseFloat(spanp50.innerHTML));

          console.log(result.price / 2 > parseFloat(spanp50.innerHTML));

          if (
            result.price < parseFloat(spanp50.innerHTML) &&
            parseFloat(spanp50.innerHTML) - parseFloat(spanp5.innerHTML) >
              result.price / 2
          )
            texteGoodBad =
              "Good deal. There is a high probability that you can win some money";
          if (
            result.price < parseFloat(spanp5.innerHTML) &&
            parseFloat(spanp50.innerHTML) - parseFloat(spanp5.innerHTML) >
              result.price / 2
          )
            texteGoodBad =
              "Good deal. There is a high probability that you can win some money";
          if (
            result.price < parseFloat(spanp5.innerHTML) &&
            parseFloat(spanp50.innerHTML) - parseFloat(spanp5.innerHTML) > 20
          )
            texteGoodBad = "Good deal. You can win some pocket money";
          if (result.price < parseFloat(spanp50.innerHTML))
            texteGoodBad = "Ok deal. You can start to see the functioning";
          else {
            texteGoodBad =
              "Bad deals. The gain would be minimal or inexistant";
          }
        }
      }
    }
  }

  goodBad.innerHTML = `${texteGoodBad}`;
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

const favContent = document.getElementById("favContent");
const iconChevronFav = document.getElementById("icon-chevron-fav");

favContent.addEventListener("shown.bs.collapse", function () {
  iconChevronFav.classList.remove("bi-chevron-right");
  iconChevronFav.classList.add("bi-chevron-down");
});

favContent.addEventListener("hidden.bs.collapse", function () {
  iconChevronFav.classList.remove("bi-chevron-down");
  iconChevronFav.classList.add("bi-chevron-right");
});

// Get element when add-favotrite is clicked
document.addEventListener("click", async (event) => {
  if (event.target.classList.contains("add-favorite")) {
    let id = event.target.getAttribute("data-id");
    let deal = currentDeals.find((deal) => deal.id === id);
    favoriteDeals.push(deal);
    renderDeals(favoriteDeals, "fav");
    renderDeals(currentDeals);
    localStorage.setItem("favoriteDeals", JSON.stringify(favoriteDeals));
  } else if (event.target.classList.contains("remove-favorite")) {
    let id = event.target.getAttribute("data-id");
    favoriteDeals = favoriteDeals.filter((deal) => deal.id !== id);
    renderDeals(favoriteDeals, "fav");
    renderDeals(currentDeals);
    localStorage.setItem("favoriteDeals", JSON.stringify(favoriteDeals));
  }
});

renderDeals(favoriteDeals, "fav");
