let restaurants,
  neighborhoods,
  cuisines
var map
var markers = []

// =====================================
// Checking if Service Worker is avaible
// =====================================
if (navigator.serviceWorker) {
  navigator.serviceWorker.register('./service-worker.js', {
      scope: './'
    })
    .then(function (registration) {
      console.log('ServiceWorker Register');
    })
    .catch(function (e) {
      console.log('error')
      console.error(e);
    })
} else {
  console.log('ServiceWorker not supported.');
}

/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', async (event) => {
  await fetchNeighborhoods();
  fetchCuisines();
});

/**
 * Fetch all neighborhoods and set their HTML.
 */
fetchNeighborhoods = () => {
  // DONE
  DBHelper.fetchNeighborhoods(neighborhoods)
    .then((results) => {
      self.neighborhoods = results;
      fillNeighborhoodsHTML();
    }).catch((err) => {
      console.log(err);
    })
}

/**
 * Set neighborhoods HTML.
 */
fillNeighborhoodsHTML = (neighborhoods = self.neighborhoods) => {
  const select = document.getElementById('neighborhoods-select');
  neighborhoods.forEach(neighborhood => {
    const option = document.createElement('option');
    option.innerHTML = neighborhood;
    option.value = neighborhood;
    select.append(option);
  });
}

/**
 * Fetch all cuisines and set their HTML.
 */
fetchCuisines = (cuisines) => {
  // DONE
  DBHelper.fetchCuisines(cuisines)
    .then((resutls) => {
      self.cuisines = resutls;
      fillCuisinesHTML();
    })
    .catch((err) => {
      console.log(err);
    })
}

/**
 * Set cuisines HTML.
 */
fillCuisinesHTML = (cuisines = self.cuisines) => {
  const select = document.getElementById('cuisines-select');

  cuisines.forEach(cuisine => {
    const option = document.createElement('option');
    option.innerHTML = cuisine;
    option.value = cuisine;
    select.append(option);
  });
}

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
  let loc = {
    lat: 40.722216,
    lng: -73.987501
  };
  self.map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: loc,
    scrollwheel: false
  });
  updateRestaurants();
}

/**
 * Update page and map for current restaurants.
 */
updateRestaurants = () => {
  const cSelect = document.getElementById('cuisines-select');
  const nSelect = document.getElementById('neighborhoods-select');

  const cIndex = cSelect.selectedIndex;
  const nIndex = nSelect.selectedIndex;

  const cuisine = cSelect[cIndex].value;
  const neighborhood = nSelect[nIndex].value;
  // DONE
  DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood)
  .then((results) => {
    resetRestaurants(results);
      fillRestaurantsHTML();
  }).catch((err) => {
    console.log(err);
  })
}

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
resetRestaurants = (restaurants) => {
  // Remove all restaurants
  self.restaurants = [];
  const ul = document.getElementById('restaurants-list');
  ul.innerHTML = '';

  // Remove all map markers
  self.markers.forEach(m => m.setMap(null));
  self.markers = [];
  self.restaurants = restaurants;
}

/**
 * Create all restaurants HTML and add them to the webpage.
 */
fillRestaurantsHTML = (restaurants = self.restaurants) => {
  const ul = document.getElementById('restaurants-list');
  restaurants.forEach(restaurant => {
    ul.append(createRestaurantHTML(restaurant));
  });
  addMarkersToMap();
}

/**
 * Create restaurant HTML.
 */
createRestaurantHTML = (restaurant) => {
  const li = document.createElement('li');

  const imageID = DBHelper.imageUrlForRestaurant_responsive(restaurant);
  const figure = document.createElement('figure');
  const picture = document.createElement('picture');
  const sourceLarge = document.createElement('source');
  const sourceSmall = document.createElement('source');
  const image = document.createElement('img');
  const figCaption = document.createElement('figcaption');

  sourceLarge.setAttribute('media', '(min-width: 501px)');
  sourceLarge.setAttribute('srcset', `${imageID}_large_2x.jpg 2x, ${imageID}_large_1x.jpg`);
  sourceSmall.setAttribute('media', '(max-width: 500px)');
  sourceSmall.setAttribute('srcset', `${imageID}_small_2x.jpg 2x, ${imageID}_small_1x.jpg`);
  image.className = 'restaurant-img';
  image.src = DBHelper.imageUrlForRestaurant(restaurant);
  image.setAttribute("alt", restaurant.name)
  figCaption.textContent = restaurant.name;
  figure.append(picture);
  figure.append(figCaption)
  picture.append(sourceLarge);
  picture.append(sourceSmall);
  picture.append(image);
  li.append(figure);



  const name = document.createElement('h1');
  name.innerHTML = restaurant.name;
  li.append(name);

  const isFavorite = document.createElement('button');
  isFavorite.innerHTML = '&hearts;';
  isFavorite.classList.add('isFavorite')
  // Set styles depending if is favorite or not
  if (restaurant.is_favorite === 'true' | restaurant.is_favorite === true) {
    isFavorite.classList.add('yesFav')
    console.log(`Status for ${restaurant.id} is true ad type is ${typeof(restaurant.is_favorite)}`);
  } else if(restaurant.is_favorite === 'false' | restaurant.is_favorite === false) {
    isFavorite.classList.remove('yesFav')
    console.log(`Status for ${restaurant.id} is false ad type is ${typeof(restaurant.is_favorite)}`);
  }

  // Updating data base base on favorite status
  isFavorite.onclick = () => {
    isFavorite.classList.toggle('yesFav')
    const currentFavStatus = !JSON.parse(restaurant.is_favorite);
    console.log(currentFavStatus);
    updateFavoriteStatus(restaurant.id, currentFavStatus);
    restaurant.is_favorite = currentFavStatus
    console.log(restaurant.is_favorite);
  }
  li.append(isFavorite);

  const neighborhood = document.createElement('p');
  neighborhood.innerHTML = restaurant.neighborhood;
  li.append(neighborhood);

  const address = document.createElement('p');
  address.innerHTML = restaurant.address;
  li.append(address);

  const more = document.createElement('a');
  more.innerHTML = 'View Details';
  more.href = DBHelper.urlForRestaurant(restaurant);
  li.append(more)

  return li
}

/**
 * Add markers for current restaurants to the map.
 */
addMarkersToMap = (restaurants = self.restaurants) => {
  restaurants.forEach(restaurant => {
    // Add marker to the map
    const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.map);
    google.maps.event.addListener(marker, 'click', () => {
      window.location.href = marker.url
    });
    self.markers.push(marker);
  });
}