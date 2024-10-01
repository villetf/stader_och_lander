const nav = document.querySelector('nav');
const visited = document.getElementById('visited');

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

function createNavButton(countries, cities) {
   console.log('countries,', countries);
   console.log('cities', cities);

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
         dropdownDiv.appendChild(citySpan);
      }
   }
}
