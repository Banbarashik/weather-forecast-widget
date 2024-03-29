export default class View {
  _spinner = document.getElementById('spinner');

  isFirstRender = true;

  render(data) {
    this._data = data;

    const markup = this._generateMarkup();

    this.clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);

    this._hideSpinner();

    this.isFirstRender = false;
  }

  update(data) {
    this._data = data;
    // Markup build from the changed state object
    const updatedMarkup = this._generateMarkup();

    const newDOM = document
      .createRange()
      .createContextualFragment(updatedMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    // Compare new and current markup elements
    newElements.map(function (newEl, i) {
      const curEl = curElements[i];

      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      )
        curEl.textContent = newEl.textContent;

      if (!newEl.isEqualNode(curEl)) {
        // Go through new elements attributes and set them to current elements
        // that has changed
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  clear() {
    this._parentElement.textContent = '';
  }

  _hideSpinner() {
    this._spinner.className = 'hidden';
  }
}
