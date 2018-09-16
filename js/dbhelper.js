// let restaurants

// const defineRest = async () => {
//   const results = await getAllRestaurants()
//   restaurants =  results
// }
async function storeRestaurantsDb(restaurants) {
  let db = await idb.open('restaurants-db', 1, upgradeDB => upgradeDB.createObjectStore('restaurants', {
    keyPath: 'id'
  }))

  let tx = db.transaction('restaurants', 'readwrite')
  let store = tx.objectStore('restaurants')

  restaurants.forEach(restaurant => {
    store.put(restaurant)
  });

  await tx.complete
  db.close()
}

async function getAllRestaurants() {
  let db = await idb.open('restaurants-db', 1)

  let tx = db.transaction('restaurants', 'readonly')
  let store = tx.objectStore('restaurants')

  let allSavedItems = await store.getAll()

  db.close()

  return allSavedItems
}

async function updateFavoriteStatus(restaurantId, favoriteStatus) {
  await fetch(`http://localhost:1337/restaurants/${restaurantId}/?is_favorite=${favoriteStatus}`, {
    method: 'PUT'
  });
  const db = await idb.open('restaurants-db', 1);
  const tx = db.transaction('restaurants', 'readwrite');
  const store = tx.objectStore('restaurants');

  store.get(restaurantId)
    .then(resturant => {
      resturant.is_favorite = favoriteStatus;
      store.put(resturant);
    });

  await tx.complete;
  db.close();
}

class DBHelper {

  /**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */
  static get DATABASE_URL() {
    const port = 1337 // Change this to your server port
    return `http://localhost:${port}/restaurants`;
  }

  /**
   * Fetch all restaurants.
   * WORKING
   */
  static async fetchRestaurants() {
    const response = await fetch(`${DBHelper.DATABASE_URL}`)

    if (response.status === 200) {
      const restaurants = await response.json()
      await storeRestaurantsDb(restaurants)
      return restaurants
    } else {
      throw new Error('Request of restaurants has failed')
    }
  }

  /**
   * Fetch a restaurant by its ID.
   * WORKING
   */
  static async fetchRestaurantById(id) {

    await DBHelper.fetchRestaurants().then((restaurants) => {
      console.log(restaurants)
    }).catch((err) => {
      console.log('Error', err);
    })
    // Fetch all restaurants from IndexedDB
    const restaurants = await getAllRestaurants()
    const restaurant = restaurants.find(r => r.id == id)
    if (restaurant) {
      return restaurant
    } else {
      throw new Error('Restaurant does not exist')
    }
  }

  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   * WORKING
   */
  static async fetchRestaurantByNeighborhood(neighborhood) {

    // Fetch all restaurants from IndexedDB
    const restaurants = await getAllRestaurants();

    if (restaurants) {
      const results = restaurants.filter(r => r.neighborhood == neighborhood);
      return results
    } else {
      throw new Error('Neigborhood does not exist')
    }
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   * WORKING
   */
  static async fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood) {
    await DBHelper.fetchRestaurants().then((restaurants) => {
      console.log(restaurants)
    }).catch((err) => {
      console.log('Error', err);
    })
    // Fetch all restaurants from IndexedDB
    const restaurants = await getAllRestaurants();

    if (restaurants) {
      let results = restaurants
      if (cuisine != 'all') { // filter by cuisine
        results = results.filter(r => r.cuisine_type == cuisine);
      }
      if (neighborhood != 'all') { // filter by neighborhood
        results = results.filter(r => r.neighborhood == neighborhood);
      }

      return results
    } else {
      throw new Error('Restaurants with cuisine and neighborhood conbination does not exist')
    }
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   * WORKING
   */
  static async fetchNeighborhoods() {
    await DBHelper.fetchRestaurants().then((restaurants) => {
      console.log(restaurants)
    }).catch((err) => {
      console.log('Error', err);
    })
    // Fetch all restaurants from IndexedDB
    const restaurants = await getAllRestaurants();

    if (restaurants) {
      // Get all neighborhoods from all restaurants
      const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
      // Remove duplicates from neighborhoods
      const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)

      return uniqueNeighborhoods
    } else {
      throw new Error('Failed at fetching all neighborhoods')
    }
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static async fetchCuisines() {
    await DBHelper.fetchRestaurants().then((restaurants) => {
      console.log(restaurants)
    }).catch((err) => {
      console.log('Error', err);
    })
    // Fetch all restaurants from IndexedDB
    const restaurants = await getAllRestaurants();

    if (restaurants) {
      const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
      // Remove duplicates from cuisines
      const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)

      return uniqueCuisines
    } else {
      throw new Error('Failed at fetching all cuisine')
    }
  }

  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return (`./restaurant.html?id=${restaurant.id}`);
  }

  /**
   * Restaurant image URL.
   * Error checking due to restaurant #10 does not have a photo property
   */
  static imageUrlForRestaurant(restaurant) {
    const photo = restaurant.photograph;

    if (photo === undefined) {
      return (`/img/error.jpg`);
    } else {
      return (`/img/${restaurant.photograph}.jpg`);
    }
  }

  /**
   * Responsive image only gets the name of the picture by id wihout getting the extension, extension will be added in later
   * Error checking due to restaurant #10 does not have a photo property
   */
  static imageUrlForRestaurant_responsive(restaurant) {

    const photo = restaurant.photograph;

    if (photo === undefined) {
      return (`img/responsive_img/error`);
    } else {
      return (`img/responsive_img/${restaurant.id}`);
    }
  }

  /**
   * Map marker for a restaurant.
   */
  static mapMarkerForRestaurant(restaurant, map) {
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant),
      map: map,
      animation: google.maps.Animation.DROP
    });
    return marker;
  }
}

// async () => {
// Makes initial fetch request and saves it into IndexedDB
//   await DBHelper.fetchRestaurants().then((restaurants) =>{
//     console.log(restaurants)
//   }).catch((err) =>{
//     console.log('Error', err);
//   })
// }