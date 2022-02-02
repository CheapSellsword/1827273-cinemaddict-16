import AbstractView from './abstract-view';

const createShowMoreButtonTemplate = () => (
  `<button class="films-list__show-more">
    Show more
  </button>`
);

export default class ShowMoreButtonView extends AbstractView {

  get template() {
    return createShowMoreButtonTemplate();
  }

  setShowMoreButtonClickHandler = (callback) => {

    this._callback.showMoreButtonClick = callback;

    this.element.addEventListener('click', this.#showMoreButtonClickHandler);
  }

  #showMoreButtonClickHandler = (evt) => {

    evt.preventDefault();

    this._callback.showMoreButtonClick();
  }
}
