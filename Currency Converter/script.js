import { countryList, currencyMeta } from "./country.js";

    const BASE_URL = "https://latest.currency-api.pages.dev/v1/currencies";



const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;

    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }

    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}


const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;

  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }

  const URL = `https://latest.currency-api.pages.dev/v1/currencies/${fromCurr.value.toLowerCase()}.json`;

  let response = await fetch(URL);
  let data = await response.json();

  let rate = data[fromCurr.value.toLowerCase()][toCurr.value.toLowerCase()];
  let finalAmount = (amtVal * rate).toFixed(2);

  msg.textContent = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
};


const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", () => {
  updateExchangeRate();
});




const fromSearch = document.querySelector('.search-from');
const toSearch = document.querySelector('.search-to');
const suggestFrom = document.querySelector('.suggest-from');
const suggestTo = document.querySelector('.suggest-to');

const swapIcon = document.querySelector('.dropdown i');

// Swap from/to when the exchange icon is clicked
if (swapIcon) {
  swapIcon.addEventListener('click', () => {
    const fromSelect = document.querySelector("select[name='from']");
    const toSelect = document.querySelector("select[name='to']");
    const prevFrom = fromSelect.value;
    const prevTo = toSelect.value;
    // swap values
    fromSelect.value = prevTo;
    toSelect.value = prevFrom;
    // update the small search inputs so UI matches
    const fromInput = document.querySelector('.search-from');
    const toInput = document.querySelector('.search-to');
    if (fromInput) fromInput.value = fromSelect.value;
    if (toInput) toInput.value = toSelect.value;
    // update flags and exchange rate
    updateFlag(fromSelect);
    updateFlag(toSelect);
    updateExchangeRate();
  });
}

const buildSuggestions = (searchText, type) => {
  const list = type === 'from' ? suggestFrom : suggestTo;
  const select = document.querySelector(`select[name='${type}']`);
  list.innerHTML = '';
  const query = searchText.trim().toLowerCase();
  if (!query) {
    list.style.display = 'none';
    return;
  }

  const matches = Object.keys(countryList).filter(code => {
    const codeMatch = code.toLowerCase().startsWith(query);
    const meta = (typeof currencyMeta !== 'undefined' && currencyMeta[code]) ? currencyMeta[code] : null;
    const name = meta && meta.name ? meta.name.toLowerCase() : '';
    const country = meta && meta.country ? meta.country.toLowerCase() : '';
    const nameMatch = name.includes(query) || country.includes(query);
    return codeMatch || nameMatch;
  });
  if (matches.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'No match';
    li.className = 'no-match';
    list.appendChild(li);
  } else {
    matches.slice(0, 10).forEach(code => {
      const li = document.createElement('li');
      const countryCode = countryList[code];
      li.innerHTML = `<img src="https://flagsapi.com/${countryCode}/flat/24.png" alt="${code}"/> <span class="code">${code}</span>`;
      li.addEventListener('click', () => {
        select.value = code;
        if (type === 'from') fromSearch.value = code; else toSearch.value = code;
        updateFlag(select);
        updateExchangeRate();
        list.innerHTML = '';
        list.style.display = 'none';
      });
      list.appendChild(li);
    });
  }
  list.style.display = 'block';
};

fromSearch.addEventListener('input', (e) => {
  buildSuggestions(e.target.value, 'from');
});

toSearch.addEventListener('input', (e) => {
  buildSuggestions(e.target.value, 'to');
});

// Hide suggestions when clicking outside the respective control
document.addEventListener('click', (e) => {
  if (!e.target.closest('.from')) {
    suggestFrom.innerHTML = '';
    suggestFrom.style.display = 'none';
  }
  if (!e.target.closest('.to')) {
    suggestTo.innerHTML = '';
    suggestTo.style.display = 'none';
  }
});


