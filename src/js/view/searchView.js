import View from './View';

class SearchView extends View {
  _parentElement = document.getElementById('search-suggestions__list');
  _data;

  _searchBar = document.getElementById('location-search-bar');

  addHandlerShowSearchSuggestions(handler) {
    this._searchBar.addEventListener('input', function (e) {
      const { value: query } = e.target;

      handler(query);
    });
  }

  addHandlerShowCurrentWeather(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const suggestion = e.target.closest('.search-suggestions__item');
      if (!suggestion) return;

      const { index } = suggestion.dataset;
      handler(index);
    });
  }

  _generateMarkup() {
    return this._data
      .map(
        ({ name, region, country }, i) =>
          `<li class="search-suggestions__item" data-index="${i}">${name}, ${
            region ? region + ',' : ''
          } ${country}</li>`
      )
      .join('');
  }
}

export default new SearchView();
