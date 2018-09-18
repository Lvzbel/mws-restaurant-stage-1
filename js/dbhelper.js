  /**
   * Create restaurants IndexedDB
   */
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

  /**
   * Store reviews by restaurant id in IndexedDB
   */
  async function storeAllReviews(reviews, id) {
    let db = await idb.open(`reviews-db-id:${id}`, 1, upgradeDB => upgradeDB.createObjectStore(`reviews-id:${id}`, {
      keyPath: 'id'
    }))

    let tx = db.transaction(`reviews-id:${id}`, 'readwrite')
    let store = tx.objectStore(`reviews-id:${id}`)
    reviews.forEach(review => {
      store.put(review)
    });

    await tx.complete
    db.close()
  }

  async function getReviewsByRestaurantId(id) {
    let db = await idb.open(`reviews-db-id:${id}`, 1)

    let tx = db.transaction(`reviews-id:${id}`, 'readonly')
    let store = tx.objectStore(`reviews-id:${id}`)

    let allSavedItems = await store.getAll()

    db.close()

    return allSavedItems
  }

  /**
   * Retrive all restaurants from IndexedDB
   */
  async function getAllRestaurants() {
    let db = await idb.open('restaurants-db', 1)

    let tx = db.transaction('restaurants', 'readonly')
    let store = tx.objectStore('restaurants')

    let allSavedItems = await store.getAll()

    db.close()

    return allSavedItems
  }

  /**
   * Store all restaurants in IndexedDB.
   */
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

  /**
   * POST new review
   */
  async function postReview(review) {
    await fetch('http://localhost:1337/reviews', {
      method: 'POST',
      body: JSON.stringify(review),
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    })
  }
  /**
   * Update Favorite Status in a restaurant
   */
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

  /**
   * Update Favorite Status in a restaurant
   */
  async function fetchReviewsById(id) {
    let reviewResponse = await fetch(`http://localhost:1337/reviews/?restaurant_id=${id}`)
    if (reviewResponse.status === 200) {
      const reviews = await reviewResponse.json()
      await storeAllReviews(reviews, id)
      return reviews
    } else {
      throw new Error('Resquest of reviews has failed')
    }
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
      // Fetch resturants data base
      const restaurantResponse = await fetch(`${DBHelper.DATABASE_URL}`)

      if (restaurantResponse.status === 200) {
        const restaurants = await restaurantResponse.json()
        // store restaurant data base into IndexedDB
        await storeRestaurantsDb(restaurants)
        // // fetch and store all reviews
        // const reviewResponse = await fetch(`${DBHelper.REVIEWDATA_URL}`)

        // if (reviewResponse.status === 200) {
        //   const reviews = await reviewResponse.json()
        //   await storeAllReviews(reviews)
        // } else {
        //   throw new Error('Request of reviews has failed')
        // }
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

    static async sendOfflineData(review) {
      // Store the review on local storage
      localStorage.setItem('data', JSON.stringify(review));

      // Build temporary UI and append to the already list of reviews
      const ul = document.getElementById('reviews-list');
      const li = document.createElement('li');

      const name = document.createElement('p');
      name.innerHTML = review.name;
      li.appendChild(name)

      const date = document.createElement('p');
      date.innerHTML = new Date().toDateString();
      li.appendChild(date);

      const rating = document.createElement('p');
      rating.innerHTML = `Rating: ${review.rating}`;
      li.appendChild(rating);

      const comments = document.createElement('p');
      comments.innerHTML = review.comments;
      li.appendChild(comments);

      ul.appendChild(li)

      // Show Offline Alert
      const offlineAlert = document.getElementById("offline-alert")
      offlineAlert.style.display = "block";

      // Wait until client is back online
      window.addEventListener('online', (event) => {
        // Getting data from localStorage
        let review = JSON.parse(localStorage.getItem('data'))
        // Sending review to the server
        postReview(review)

        // Remove offline notitication
        offlineAlert.style.display = "none";

        // Remove localStorage data
        localStorage.removeItem('data')
      })
    }
  }