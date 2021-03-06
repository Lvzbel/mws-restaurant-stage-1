async function storeRestaurantsDb(e) {
  let t = await idb.open("restaurants-db", 1, e =>
      e.createObjectStore("restaurants", { keyPath: "id" })
    ),
    a = t.transaction("restaurants", "readwrite"),
    n = a.objectStore("restaurants");
  e.forEach(e => {
    n.put(e);
  }),
    await a.complete,
    t.close();
}
async function storeAllReviews(e, t) {
  let a = await idb.open(`reviews-db-id:${t}`, 1, e =>
      e.createObjectStore(`reviews-id:${t}`, { keyPath: "id" })
    ),
    n = a.transaction(`reviews-id:${t}`, "readwrite"),
    r = n.objectStore(`reviews-id:${t}`);
  e.forEach(e => {
    r.put(e);
  }),
    await n.complete,
    a.close();
}
async function getReviewsByRestaurantId(e) {
  let t = await idb.open(`reviews-db-id:${e}`, 1),
    a = t
      .transaction(`reviews-id:${e}`, "readonly")
      .objectStore(`reviews-id:${e}`),
    n = await a.getAll();
  return t.close(), n;
}
async function getAllRestaurants() {
  let e = await idb.open("restaurants-db", 1),
    t = e.transaction("restaurants", "readonly").objectStore("restaurants"),
    a = await t.getAll();
  return e.close(), a;
}
async function storeRestaurantsDb(e) {
  let t = await idb.open("restaurants-db", 1, e =>
      e.createObjectStore("restaurants", { keyPath: "id" })
    ),
    a = t.transaction("restaurants", "readwrite"),
    n = a.objectStore("restaurants");
  e.forEach(e => {
    n.put(e);
  }),
    await a.complete,
    t.close();
}
async function postReview(e) {
  await fetch("https://udacitysails.azurewebsites.net/reviews", {
    method: "POST",
    body: JSON.stringify(e),
    headers: new Headers({ "Content-Type": "application/json" })
  });
}
async function updateFavoriteStatus(e, t) {
  await fetch(
    `https://udacitysails.azurewebsites.net/restaurants/${e}/?is_favorite=${t}`,
    { method: "PUT" }
  );
  const a = await idb.open("restaurants-db", 1),
    n = a.transaction("restaurants", "readwrite"),
    r = n.objectStore("restaurants");
  r.get(e).then(e => {
    (e.is_favorite = t), r.put(e);
  }),
    await n.complete,
    a.close();
}
async function fetchReviewsById(e) {
  let t = await fetch(
    `https://udacitysails.azurewebsites.net/reviews/?restaurant_id=${e}`
  );
  if (200 === t.status) {
    const a = await t.json();
    return await storeAllReviews(a, e), a;
  }
  throw new Error("Resquest of reviews has failed");
}
const toggleFavClassAndElement = (e, t) => {
  ("true" === e) | (!0 === e)
    ? (t.classList.add("yesFav"),
      t.setAttribute("aria-label", "remove as favorite"))
    : (t.classList.remove("yesFav"),
      t.setAttribute("aria-label", "remove as favorite"));
};
class DBHelper {
  static get DATABASE_URL() {
    return "https://udacitysails.azurewebsites.net/restaurants";
  }
  static async fetchRestaurants() {
    const e = await fetch(`${DBHelper.DATABASE_URL}`);
    if (200 === e.status) {
      const t = await e.json();
      return await storeRestaurantsDb(t), t;
    }
    throw new Error("Request of restaurants has failed");
  }
  static async fetchRestaurantById(e) {
    await DBHelper.fetchRestaurants()
      .then(e => {
        console.log(e);
      })
      .catch(e => {
        console.log("Error", e);
      });
    const t = (await getAllRestaurants()).find(t => t.id == e);
    if (t) return t;
    throw new Error("Restaurant does not exist");
  }
  static async fetchRestaurantByNeighborhood(e) {
    const t = await getAllRestaurants();
    if (t) return t.filter(t => t.neighborhood == e);
    throw new Error("Neigborhood does not exist");
  }
  static async fetchRestaurantByCuisineAndNeighborhood(e, t) {
    await DBHelper.fetchRestaurants()
      .then(e => {
        console.log(e);
      })
      .catch(e => {
        console.log("Error", e);
      });
    const a = await getAllRestaurants();
    if (a) {
      let n = a;
      return (
        "all" != e && (n = n.filter(t => t.cuisine_type == e)),
        "all" != t && (n = n.filter(e => e.neighborhood == t)),
        n
      );
    }
    throw new Error(
      "Restaurants with cuisine and neighborhood conbination does not exist"
    );
  }
  static async fetchNeighborhoods() {
    await DBHelper.fetchRestaurants()
      .then(e => {
        console.log(e);
      })
      .catch(e => {
        console.log("Error", e);
      });
    const e = await getAllRestaurants();
    if (e) {
      const t = e.map((t, a) => e[a].neighborhood);
      return t.filter((e, a) => t.indexOf(e) == a);
    }
    throw new Error("Failed at fetching all neighborhoods");
  }
  static async fetchCuisines() {
    await DBHelper.fetchRestaurants()
      .then(e => {
        console.log(e);
      })
      .catch(e => {
        console.log("Error", e);
      });
    const e = await getAllRestaurants();
    if (e) {
      const t = e.map((t, a) => e[a].cuisine_type);
      return t.filter((e, a) => t.indexOf(e) == a);
    }
    throw new Error("Failed at fetching all cuisine");
  }
  static urlForRestaurant(e) {
    return `./restaurant.html?id=${e.id}`;
  }
  static imageUrlForRestaurant(e) {
    return void 0 === e.photograph
      ? "/img/error.jpg"
      : `/img/${e.photograph}.jpg`;
  }
  static imageUrlForRestaurant_responsive(e) {
    return void 0 === e.photograph
      ? "img/responsive_img/error"
      : `img/responsive_img/${e.id}`;
  }
  static mapMarkerForRestaurant(e, t) {
    return new google.maps.Marker({
      position: e.latlng,
      title: e.name,
      url: DBHelper.urlForRestaurant(e),
      map: t,
      animation: google.maps.Animation.DROP
    });
  }
  static async sendOfflineData(e) {
    localStorage.setItem("data", JSON.stringify(e));
    const t = document.getElementById("reviews-list"),
      a = document.createElement("li"),
      n = document.createElement("p");
    (n.innerHTML = e.name), a.appendChild(n);
    const r = document.createElement("p");
    (r.innerHTML = new Date().toDateString()), a.appendChild(r);
    const s = document.createElement("p");
    (s.innerHTML = `Rating: ${e.rating}`), a.appendChild(s);
    const o = document.createElement("p");
    (o.innerHTML = e.comments), a.appendChild(o), t.appendChild(a);
    const i = document.getElementById("offline-alert");
    (i.style.display = "block"),
      window.addEventListener("online", e => {
        postReview(JSON.parse(localStorage.getItem("data"))),
          (i.style.display = "none"),
          localStorage.removeItem("data");
      });
  }
}
let restaurants, neighborhoods, cuisines;
var map,
  markers = [];
navigator.serviceWorker
  ? navigator.serviceWorker
      .register("./service-worker.js", { scope: "./" })
      .then(function(e) {
        console.log("ServiceWorker Register");
      })
      .catch(function(e) {
        console.log("error"), console.error(e);
      })
  : console.log("ServiceWorker not supported."),
  document.addEventListener("DOMContentLoaded", async e => {
    await fetchNeighborhoods(), fetchCuisines();
  }),
  (fetchNeighborhoods = () => {
    DBHelper.fetchNeighborhoods(neighborhoods)
      .then(e => {
        (self.neighborhoods = e), fillNeighborhoodsHTML();
      })
      .catch(e => {
        console.log(e);
      });
  }),
  (fillNeighborhoodsHTML = (e = self.neighborhoods) => {
    const t = document.getElementById("neighborhoods-select");
    e.forEach(e => {
      const a = document.createElement("option");
      (a.innerHTML = e), (a.value = e), t.append(a);
    });
  }),
  (fetchCuisines = e => {
    DBHelper.fetchCuisines(e)
      .then(e => {
        (self.cuisines = e), fillCuisinesHTML();
      })
      .catch(e => {
        console.log(e);
      });
  }),
  (fillCuisinesHTML = (e = self.cuisines) => {
    const t = document.getElementById("cuisines-select");
    e.forEach(e => {
      const a = document.createElement("option");
      (a.innerHTML = e), (a.value = e), t.append(a);
    });
  });
const fakeMap = document
  .getElementById("map-button")
  .addEventListener("click", () => {
    const e = document.getElementById("toggle-container"),
      t = document.getElementById("map-container");
    e.classList.add("hide-container"), t.classList.add("show-container");
  });
(window.initMap = () => {
  (self.map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: { lat: 40.722216, lng: -73.987501 },
    scrollwheel: !1
  })),
    updateRestaurants();
}),
  (updateRestaurants = () => {
    const e = document.getElementById("cuisines-select"),
      t = document.getElementById("neighborhoods-select"),
      a = e.selectedIndex,
      n = t.selectedIndex,
      r = e[a].value,
      s = t[n].value;
    DBHelper.fetchRestaurantByCuisineAndNeighborhood(r, s)
      .then(e => {
        resetRestaurants(e), fillRestaurantsHTML();
      })
      .catch(e => {
        console.log(e);
      });
  }),
  (resetRestaurants = e => {
    (self.restaurants = []),
      (document.getElementById("restaurants-list").innerHTML = ""),
      self.markers.forEach(e => e.setMap(null)),
      (self.markers = []),
      (self.restaurants = e);
  }),
  (fillRestaurantsHTML = (e = self.restaurants) => {
    const t = document.getElementById("restaurants-list");
    e.forEach(e => {
      t.append(createRestaurantHTML(e));
    }),
      addMarkersToMap();
  }),
  (createRestaurantHTML = e => {
    const t = document.createElement("li"),
      a = DBHelper.imageUrlForRestaurant_responsive(e),
      n = document.createElement("figure"),
      r = document.createElement("picture"),
      s = document.createElement("source"),
      o = document.createElement("source"),
      i = document.createElement("img"),
      c = document.createElement("figcaption");
    s.setAttribute("class", "lazyload"),
      s.setAttribute("media", "(min-width: 501px)"),
      s.setAttribute("data-srcset", `${a}_large_2x.jpg 2x, ${a}_large_1x.jpg`),
      o.setAttribute("class", "lazyload"),
      o.setAttribute("media", "(max-width: 500px)"),
      o.setAttribute("data-srcset", `${a}_small_2x.jpg 2x, ${a}_small_1x.jpg`),
      (i.className = "restaurant-img lazyload"),
      i.setAttribute("data-src", `${DBHelper.imageUrlForRestaurant(e)}`),
      i.setAttribute("alt", e.name),
      (c.textContent = e.name),
      n.append(r),
      n.append(c),
      r.append(s),
      r.append(o),
      r.append(i),
      t.append(n);
    const l = document.createElement("h1");
    (l.innerHTML = e.name), t.append(l);
    const d = document.createElement("button");
    (d.innerHTML = "&hearts;"),
      d.classList.add("isFavorite"),
      toggleFavClassAndElement(e.is_favorite, d),
      (d.onclick = () => {
        const t = !JSON.parse(e.is_favorite);
        console.log(t),
          updateFavoriteStatus(e.id, t),
          (e.is_favorite = t),
          toggleFavClassAndElement(e.is_favorite, d);
      }),
      t.append(d);
    const u = document.createElement("p");
    (u.innerHTML = e.neighborhood), t.append(u);
    const p = document.createElement("p");
    (p.innerHTML = e.address), t.append(p);
    const h = document.createElement("a");
    return (
      (h.innerHTML = "View Details"),
      (h.href = DBHelper.urlForRestaurant(e)),
      t.append(h),
      t
    );
  }),
  (addMarkersToMap = (e = self.restaurants) => {
    e.forEach(e => {
      const t = DBHelper.mapMarkerForRestaurant(e, self.map);
      google.maps.event.addListener(t, "click", () => {
        window.location.href = t.url;
      }),
        self.markers.push(t);
    });
  });
