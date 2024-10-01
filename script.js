const nav = document.querySelector('nav');
const visited = document.getElementById('visited');

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

      const countryButton = document.createElement('span');
      countryButton.innerText = currentCountry.countryname;
      countryButton.classList.add('countryButton');

      const countryDiv = document.createElement('div');
      countryDiv.classList.add('countryDiv');
      countryDiv.appendChild(countryButton);
      nav.insertBefore(countryDiv, visited);

      const dropdownDiv = document.createElement('div');
      dropdownDiv.classList.add('dropdownDiv');
      countryButton.appendChild(dropdownDiv);

      for (const city in cities) {
         const currentCity = cities[city];
         if (currentCity.countryid != currentCountry.id) {
            continue;
         }

         const citySpan = document.createElement('span');
         citySpan.innerText = currentCity.stadname;
         citySpan.cityId = currentCity.id;
         dropdownDiv.appendChild(citySpan);

         citySpan.onclick = () => {
            generateCityInfo(citySpan.cityId, countries, cities);
         };
      }
   }
}


// Funktion för att fylla sidan med data om rätt stad
function generateCityInfo(cityId, countries, cities) {
   const cityContent = document.getElementById('cityContent');
   const cityName = document.getElementById('cityName');
   const cityInfo = document.getElementById('cityInfo');

   const currentCityInfo = cities.filter((i) => {
      return i.id == cityId;
   })[0];

   const currentCountry = countries.filter((i) => {
      return i.id == currentCityInfo.countryid;
   })[0];

   cityName.innerText = currentCityInfo.stadname;
   cityInfo.innerText = `${currentCityInfo.stadname} är en stad som ligger i ${currentCountry.countryname} och har ${currentCityInfo.population} invånare.`;

   if (document.getElementById('visitedButton')) {
      document.getElementById('visitedButton').remove();
   }
   const visitedButton = document.createElement('button');
   visitedButton.id = 'visitedButton';
   visitedButton.innerText = 'Markera som besökt';
   cityContent.appendChild(visitedButton);

   if (JSON.parse(localStorage.getItem('citiesVisited').includes(cityId))) {
      visitedButton.innerText = `Du har besökt ${currentCityInfo.stadname}!`;
   } else {
      visitedButton.onclick = () => {
         setToLocalStorage(cityId);
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