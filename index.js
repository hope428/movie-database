const searchForm = document.getElementById("search-bar");
const movieDIV = document.getElementById("results-list");
const watchlistBtn = document.getElementById("watchlist-btn");
const watchlistAlert = document.getElementById("added")
const buttons = document.getElementById("buttons")
const next = document.getElementById("next-btn")
const prev = document.getElementById("prev-btn")
let pageNum = 1;
let movieHTML = "";
let watchlistHTML = "";
let searchQuery;

let moviesIDArray = [];
let watchlistIDArray = JSON.parse(localStorage.getItem("watchlistMovies"));

function hide () {
  watchlistAlert.classList.add("hidden")
}

function watchlistDisplay() {
  watchlistAlert.classList.remove("hidden")
  setTimeout(hide, 800)
}

// Push imdbID to watchlistArray from onclick parameter
function addToWatchlist(movieID) {

  if (!watchlistIDArray) {
    watchlistIDArray = [];
  }
  watchlistIDArray.push(movieID);
  for (item of watchlistIDArray) {
    localStorage.setItem("watchlistMovies", JSON.stringify(watchlistIDArray));
  }

  watchlistDisplay()
}

// Function to display search results returned from api using imdbID
async function displaySearchResults() {
  for (let movieItem of moviesIDArray) {
    const displayResponse = await fetch(
      `https://www.omdbapi.com/?i=${movieItem}&apikey=3286cdc5`
    );
    const displayResponseData = await displayResponse.json();
    movieHTML = `
        <div class="movie-result">
        <img src="${displayResponseData.Poster}" />
        <div class="movie-info">
        <span class="rating">
        <h3>${displayResponseData.Title}</h3>
        <p><i class="fa-solid fa-star"></i> ${displayResponseData.Ratings[0].Value}</p>
        </span>
        <span class="details">
        <p>${displayResponseData.Runtime}</p> <p class="divider">|</p>
        <p>${displayResponseData.Genre}</p> <p class="divider">|</p>
        <p id="watchlist-btn" onclick="addToWatchlist('${displayResponseData.imdbID}')"><i class="fa-solid fa-circle-plus"></i> Watchlist</p>
        </span>
        <p class="description">${displayResponseData.Plot}</p>
        </div>
        </div>`;

    movieDIV.innerHTML += movieHTML;
  }

}

//obtains imdbID's
async function getMovie() {
  moviesIDArray = [];
  movieDIV.innerHTML = "";
  const response = await fetch(
    `https://www.omdbapi.com/?apikey=9b4197e2&s=${searchQuery}&page=${pageNum}`
  );
  const data = await response.json();

  moviesIDArray = data.Search.map((movie) => {
    return movie.imdbID;
  });

  displaySearchResults();
}

function searchMovie(e) {
  pageNum = 1;
  e.preventDefault();
  searchQuery = document.getElementById("searchbar").value;
  getMovie(searchQuery);
  document.getElementById("searchbar").value = ""; 

  next.classList.remove('hidden')
  prev.classList.remove("hidden")
}

function nextPage () {
    pageNum++
    getMovie(searchQuery)
}

function prevPage () {
  if (pageNum > 1) {
    pageNum--
  }
  getMovie(searchQuery)
}

searchForm.addEventListener("submit", searchMovie);
next.addEventListener("click", nextPage)
prev.addEventListener("click", prevPage)
