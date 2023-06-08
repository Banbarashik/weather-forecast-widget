import View from './View';

class TopPanelView extends View {
  _parentElement = document.getElementById('search__suggestions');
  _searchBar = document.getElementById('search__bar');
  _unitToggle = document.getElementById('unit-toggle').querySelector('input');
  _getUserLocationBtn = document.getElementById('get-user-location');

  _data = [{ name: '', region: '', country: '', coords: { lat: 0, lon: 0 } }];

  addHandlerSearchOnInput(handler) {
    this._searchBar.addEventListener('input', e => handler(e.target.value));
  }
  addHandlerSearchOnBlur(handler) {
    this._searchBar.addEventListener('blur', handler);
  }
  addHandlerSearchOnFocus(handler) {
    this._searchBar.addEventListener('focus', handler);
  }

  addHandlerShowForecast(handler) {
    this._parentElement.addEventListener('mousedown', function (e) {
      const suggestion = e.target.closest('.search__suggestion');
      if (!suggestion) return;

      const { index } = suggestion.dataset;
      handler(index);
    });

    this._getUserLocationBtn.addEventListener('click', () => handler());
  }

  addHandlerToggleUnit(handler) {
    this._unitToggle.addEventListener('click', handler);
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

export default new TopPanelView();
