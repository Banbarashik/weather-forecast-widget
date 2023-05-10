import View from './View';

class SearchView extends View {
  _parentElement = document.getElementById('search__suggestions');
  _searchBar = document.getElementById('search__bar');

  _data = { name: '', region: '', country: '', coords: { lat: 0, lon: 0 } };

  addHandlerToggleSearchSuggestions(handler) {
    ['input', 'focus'].forEach(ev =>
      this._searchBar.addEventListener(ev, function (e) {
        const { value: query } = e.target;

        handler(query);
      })
    );

    this._searchBar.addEventListener('blur', () => handler());
  }

  addHandlerShowForecast(handler) {
    this._parentElement.addEventListener('mousedown', function (e) {
      const suggestion = e.target.closest('.search__suggestion');
      if (!suggestion) return;

      const { index } = suggestion.dataset;
      handler(index);
    });
  }

  _generateMarkup() {
    return this._data
      .map(function (searchSuggestion, i) {
        return `
          <li class="search__suggestion" data-index="${i}">
          ${searchSuggestion.name},
          ${searchSuggestion.region ? searchSuggestion.region + ',' : ''}
          ${searchSuggestion.country}
          </li>
        `;
      })
      .join('');
  }
}

export default new SearchView();
