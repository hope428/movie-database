let watchlistIDArray = JSON.parse(localStorage.getItem("watchlistMovies"));
const watchlistDIV = document.getElementById("watchlist-container");

function remove(removedID) {
  watchlistIDArray = watchlistIDArray.filter((id) => {
    return removedID != id;
  });

  if (watchlistIDArray.length > 0)
    for (item of watchlistIDArray) {
      localStorage.setItem("watchlistMovies", JSON.stringify(watchlistIDArray));
    }
  else {
    localStorage.clear();
    watchlistIDArray = [];
  }

  watchlistDIV.innerHTML = "";
  fillWatchlist();
}

async function fillWatchlist() {
  if (watchlistIDArray && watchlistIDArray.length > 0) {
    for (let movie of watchlistIDArray) {
      const response = await fetch(
        `https://www.omdbapi.com/?i=${movie}&apikey=3286cdc5`
      );
      const responseData = await response.json();

      watchlistHTML = `
        <div class="movie-result">
        <img src="${responseData.Poster}" />
        <div class="movie-info">
        <span class="rating">
        <h3>${responseData.Title}</h3>
        <p><i class="fa-solid fa-star"></i> ${responseData.Ratings[0].Value}</p>
        </span>
        <span class="details">
        <p>${responseData.Runtime}</p> <p class="divider">|</p>
        <p>${responseData.Genre}</p> <p class="divider">|</p>
        <p id="remove-btn" onclick="remove('${responseData.imdbID}')"><i class="fa-solid fa-circle-minus"></i> Watchlist</p>
        </span>
        <p class="description">${responseData.Plot}</p>
        </div>
        </div>`;

      watchlistDIV.innerHTML += watchlistHTML;
    }
  } else {
    watchlistDIV.innerHTML = `<div class="search-placeholder">
            <i class="fa-solid fa-video-slash"></i>
            <h3>Start Searching</h3>
            </div>`;
  }
}

fillWatchlist();
