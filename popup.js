/* document.addEventListener('DOMContentLoaded', function () {
  const searchButton = document.getElementById('searchButton');
  const movieInput = document.getElementById('movieInput');
  const movieSuggestions = document.getElementById('movieSuggestions');
  const suggestionsList = document.getElementById('suggestionsList');

  searchButton.addEventListener('click', function () {
    const movieName = movieInput.value;
    if (movieName.trim() !== '') {
      redirectToSearchResults(movieName);
    }
  });

  movieInput.addEventListener('input', function () {
    const movieName = movieInput.value;
    if (movieName.trim() !== '') {
      getMovieSuggestions(movieName);
    } else {
      // Clear suggestions when the input is empty
      suggestionsList.innerHTML = '';
    }
  });

  suggestionsList.addEventListener('click', function (event) {
    const selectedMovie = event.target.textContent;
    redirectToMoviePage(selectedMovie);
  });

  function redirectToSearchResults(query) {
    chrome.tabs.create({ url: `https://letterboxd.com/search/${encodeURIComponent(query)}/` });
  }

  function redirectToMoviePage(selectedMovie) {
    const movieTitle = selectedMovie.replace(/\(\d+\)/, '').trim();
    chrome.tabs.create({ url: `https://letterboxd.com/film/${encodeURIComponent(movieTitle)}/` });
  }

  async function getMovieSuggestions(query) {
    try {
      const response = await fetch(`https://letterboxd.com/search/films/${encodeURIComponent(query)}/`);
      const data = await response.text();

      const parser = new DOMParser();
      const doc = parser.parseFromString(data, 'text/html');

      const suggestions = Array.from(doc.querySelectorAll('.results li')).map(li => {
        const titleElement = li.querySelector('.film-title-wrapper a');
        const yearElement = li.querySelector('.film-title-wrapper small a');
        const title = titleElement ? titleElement.textContent.trim() : '';
        const year = yearElement ? yearElement.textContent.trim() : '';
        return { title, year };
      });

      // Populate the custom dropdown with clickable suggestions
      suggestionsList.innerHTML = suggestions
        .map(suggestion => `<li class="suggestion">${suggestion.title} (${suggestion.year})</li>`)
        .join('');
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  }
}); */

document.addEventListener('DOMContentLoaded', function () {
  const searchButton = document.getElementById('searchButton');
  const movieInput = document.getElementById('movieInput');
  const suggestionsList = document.getElementById('suggestionsList');

  searchButton.addEventListener('click', function () {
    const movieName = movieInput.value;
    if (movieName.trim() !== '') {
      redirectToSearchResults(movieName);
    }
  });

  movieInput.addEventListener('input', function () {
    const movieName = movieInput.value;
    if (movieName.trim() !== '') {
      getMovieSuggestions(movieName);
    } else {
      // Clear suggestions when the input is empty
      suggestionsList.innerHTML = '';
    }
  });

  suggestionsList.addEventListener('click', function (event) {
    const selectedMovieLink = event.target.getAttribute('data-movie-link');
    if (selectedMovieLink) {
      const fullMovieLink = `https://letterboxd.com${selectedMovieLink}`;
      chrome.tabs.create({ url: fullMovieLink });
    }
  });

  function redirectToSearchResults(query) {
    chrome.tabs.create({ url: `https://letterboxd.com/search/${encodeURIComponent(query)}/` });
  }

  async function getMovieSuggestions(query) {
    try {
      const response = await fetch(`https://letterboxd.com/search/films/${encodeURIComponent(query)}/`);
      const data = await response.text();

      const parser = new DOMParser();
      const doc = parser.parseFromString(data, 'text/html');

      const suggestions = Array.from(doc.querySelectorAll('.results li')).map(li => {
        const titleElement = li.querySelector('.film-title-wrapper a');
        const yearElement = li.querySelector('.film-title-wrapper small a');
        
        const title = titleElement ? titleElement.textContent.trim() : '';
        const year = yearElement ? yearElement.textContent.trim() : '';
        const link = titleElement ? titleElement.getAttribute('href') : '';

        return { title, year, link };
      });

      // Populate the custom dropdown with clickable suggestions
      suggestionsList.innerHTML = suggestions
        .map(suggestion => `<li class="suggestion" data-movie-link="${suggestion.link}">${suggestion.title} (${suggestion.year})</li>`)
        .join('');
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  }
});