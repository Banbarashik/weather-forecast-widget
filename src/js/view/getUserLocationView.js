class GetUserLocationView {
  _parentElement = document.getElementById('get-user-location');

  addHandlerGetLocation(handler) {
    this._parentElement.addEventListener('click', handler);
  }
}

export default new GetUserLocationView();
