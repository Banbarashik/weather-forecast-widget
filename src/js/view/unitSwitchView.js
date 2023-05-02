import View from './View';

class UnitToggleView extends View {
  _data;

  _parentElement = document.getElementById('unit-toggle');
  _input = this._parentElement.querySelector('input');

  addHandlerToggleUnit(handler) {
    this._input.addEventListener('click', handler);
  }
}

export default new UnitToggleView();
