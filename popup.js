/* document.addEventListener('DOMContentLoaded', function () {
  const searchButton = document.getElementById('searchButton');
  const movieInput = document.getElementById('movieInput');
  const movieSuggestions = document.getElementById('movieSuggestions');

  searchButton.addEventListener('click', function () {
    const movieName = movieInput.value;
    if (movieName.trim() !== '') {
      searchOnLetterboxd(movieName);
    }
  });

  movieInput.addEventListener('input', function () {
    const movieName = movieInput.value;
    if (movieName.trim() !== '') {
      getMovieSuggestions(movieName);
    } else {
      // Clear suggestions when the input is empty
      movieSuggestions.innerHTML = '';
    }
  });

  function searchOnLetterboxd(movieName) {
    // Use your preferred method to open a new tab with the Letterboxd search URL.
    // Example:
    chrome.tabs.create({ url: `https://letterboxd.com/search/${encodeURIComponent(movieName)}/` });
  }

  async function getMovieSuggestions(query) {
    try {
      const response = await fetch(`https://letterboxd.com/search/films/${encodeURIComponent(query)}/`);
      const data = await response.text();

      // Parse the HTML response to extract movie suggestions
      const parser = new DOMParser();
      const doc = parser.parseFromString(data, 'text/html');

      // Update this part based on the actual structure of the Letterboxd search page
      const suggestions = Array.from(doc.querySelectorAll('.results li')).map(li => {
        const titleElement = li.querySelector('.film-title-wrapper a');
        const yearElement = li.querySelector('.film-title-wrapper small a');
        const title = titleElement ? titleElement.textContent.trim() : '';
        const year = yearElement ? yearElement.textContent.trim() : '';
        return { title, year };
      });

      // Populate the datalist with suggestions
      movieSuggestions.innerHTML = suggestions
        .map(suggestion => `<option value="${suggestion.title} (${suggestion.year})">`)
        .join('');
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  }
}); */

document.addEventListener('DOMContentLoaded', function () {
  const searchButton = document.getElementById('searchButton');
  const movieInput = document.getElementById('movieInput');
  const movieSuggestions = document.getElementById('movieSuggestions');

  // Function to handle search based on the input value
  function handleSearch() {
    const movieName = movieInput.value;
    if (movieName.trim() !== '') {
      // Check if a suggestion is selected in the dropdown
      const selectedOption = movieSuggestions.querySelector('option:checked');
      if (selectedOption) {
        const selectedMovie = selectedOption.value;
        redirectToMoviePage(selectedMovie);
      } else {
        // If no suggestion is selected, perform a regular search
        redirectToSearchResults(movieName);
      }
    }
  }

  searchButton.addEventListener('click', handleSearch);

  movieInput.addEventListener('input', function () {
    const movieName = movieInput.value;
    if (movieName.trim() !== '') {
      getMovieSuggestions(movieName);
    } else {
      // Clear suggestions when the input is empty
      movieSuggestions.innerHTML = '';
    }
  });

  // Add keydown event listener to handle Enter key press
  movieInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      handleSearch();
    }
  });

  function redirectToSearchResults(query) {
    // Use your preferred method to open a new tab with the Letterboxd search URL.
    // Example:
    chrome.tabs.create({ url: `https://letterboxd.com/search/${encodeURIComponent(query)}/` });
  }

  function redirectToMoviePage(selectedMovie) {
    // Use your preferred method to open a new tab with the Letterboxd movie page URL.
    // Example:
    chrome.tabs.create({ url: `https://letterboxd.com/film/${encodeURIComponent(selectedMovie)}/` });
  }

  async function getMovieSuggestions(query) {
    try {
      const response = await fetch(`https://letterboxd.com/search/films/${encodeURIComponent(query)}/`);
      const data = await response.text();

      // Parse the HTML response to extract movie suggestions
      const parser = new DOMParser();
      const doc = parser.parseFromString(data, 'text/html');

      // Update this part based on the actual structure of the Letterboxd search page
      const suggestions = Array.from(doc.querySelectorAll('.results li')).map(li => {
        const titleElement = li.querySelector('.film-title-wrapper a');
        const yearElement = li.querySelector('.film-title-wrapper small a');
        const title = titleElement ? titleElement.textContent.trim() : '';
        const year = yearElement ? yearElement.textContent.trim() : '';
        return { title, year };
      });

      // Populate the datalist with suggestions
      movieSuggestions.innerHTML = suggestions
        .map(suggestion => `<option value="${suggestion.title} (${suggestion.year})">`)
        .join('');
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  }
});