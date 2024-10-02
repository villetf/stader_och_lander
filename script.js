if (!localStorage.getItem('citiesVisited')) {
   localStorage.setItem('citiesVisited', JSON.stringify([]));
}

// Hämtar json-data från filer
Promise.all([
   fetch('json/land.json')
      .then((res) => {
         return res.json();
      }),
   fetch('json/stad.json')
      .then((res) => {
         return res.json();
      })
]).then((data) => {
   const countries = data[0];
   const cities = data[1];
   createNavButton(countries, cities);
});

// Funktion för att skapa övre meny med rätt länder och städer
function createNavButton(countries, cities) {
   for (const country in countries) {
      const currentCountry = countries[country];

      const countryDiv = createNewElement('div', null, 'countryDiv', 'countryDiv', null);
      const countryButton = createNewElement('span', currentCountry.countryname, 'countryButton', 'countryButton', countryDiv);
      document.querySelector('nav').insertBefore(countryDiv, document.getElementById('visited'));
      const dropdownDiv = createNewElement('div', null, 'dropdownDiv', 'dropdownDiv', countryButton);

      countryDiv.onclick = () => {
         dropdownDiv.classList.toggle('dropdownVisible');
      };

      for (const city in cities) {
         const currentCity = cities[city];
         if (currentCity.countryid != currentCountry.id) {
            continue;
         }

         const citySpan = createNewElement('span', currentCity.stadname, null, null, dropdownDiv);

         citySpan.onclick = () => {
            document.getElementById('cityContent').style.display = 'flex';
            if (document.getElementById('visitedContent')) {
               document.getElementById('visitedContent').style.display = 'none';
            }
            generateCityInfo(currentCity, currentCountry);
         };
      }
   }
   visited.onclick = () => {
      generateVisitedPage(cities);
   };
}



// Funktion för att fylla sidan med data om rätt stad
function generateCityInfo(currentCityInfo, currentCountry) {
   const cityContent = document.getElementById('cityContent');
   const cityName = document.getElementById('cityName');
   const cityInfo = document.getElementById('cityInfo');

   cityName.innerText = currentCityInfo.stadname;
   cityInfo.innerText = `${currentCityInfo.stadname} är en stad som ligger i ${currentCountry.countryname} och har ${currentCityInfo.population.toLocaleString('sv-SE')} invånare.`;

   if (document.getElementById('visitedButton')) {
      document.getElementById('visitedButton').remove();
   }

   const visitedButton = createNewElement('button', 'Markera som besökt', 'visitedButton', null, cityContent);

   if (JSON.parse(localStorage.getItem('citiesVisited')).includes(currentCityInfo.id)) {
      visitedButton.innerText = `Du har besökt ${currentCityInfo.stadname}!`;
   } else {
      visitedButton.onclick = () => {
         setToLocalStorage(currentCityInfo.id);
         visitedButton.innerText = `Du har besökt ${currentCityInfo.stadname}!`;
         visitedButton.onclick = '';
      };
   }
}

// Funktion för att skriva till localStorage
function setToLocalStorage(cityId) {
   const currentStorage = JSON.parse(localStorage.getItem('citiesVisited'));
   currentStorage.push(cityId);
   localStorage.setItem('citiesVisited', JSON.stringify(currentStorage));
}

// Funktion för att generera sida med besökta städer
function generateVisitedPage(cities) {
   if (document.getElementById('visitedContent')) {
      document.getElementById('visitedContent').remove();
   }

   const visitedContent = createNewElement('main', null, 'visitedContent', null, document.querySelector('body'));

   document.getElementById('cityContent').style.display = 'none';

   const visitedTitle = createNewElement('h1', null, null, null, visitedContent);
   if (localStorage.getItem('citiesVisited') == '[]') {
      visitedTitle.innerText = 'Du har inte besökt några städer.';
      return;
   }
   visitedTitle.innerText = 'Du har besökt följande städer:';

   const visitedList = createNewElement('ul', null, null, null, visitedContent);

   const visitedCities = JSON.parse(localStorage.getItem('citiesVisited'));
   let inhabitants = 0;

   for (const city in visitedCities) {
      const cityName = cities.filter((i) => {
         return i.id == visitedCities[city];
      })[0];
      createNewElement('li', cityName.stadname, null, null, visitedList);
      inhabitants += cityName.population;
   }

   createNewElement('p', `På dina resor kan du ha träffat ${inhabitants.toLocaleString('sv-SE')} personer.`, 'peopleMet', null, visitedContent);

   const clearButton = createNewElement('button', 'Rensa reshistorik', null, null, visitedContent);
   clearButton.onclick = () => {
      localStorage.setItem('citiesVisited', JSON.stringify([]));
      generateVisitedPage(cities);
   };
};


function createNewElement(elementType, text, id, classes, parent) {
   const element = document.createElement(elementType);
   element.innerText = text;

   if (id) {
      element.id = id;
   }

   if (classes) {
      element.classList = classes;
   }

   if (parent) {
      parent.appendChild(element);
   }
   return element;
}