import AbstractView from './abstract-view';
import { SortTypes } from '../consts';

const createSortItemTemplate = (type, isActive) => {
  const activeClass = isActive ? 'sort__button--active' : '';

  return (
    `<li>
      <a href="${type}" class="sort__button ${activeClass}" data-sort-type="${type}">Sort by ${type}</a>
    </li>`
  );
};

const createSortTemplate = () => {
  const createSortList = Object.values(SortTypes).map((sortElement, index) => createSortItemTemplate(sortElement, index === 0)).join('');
  return (
    `<ul class ="sort">
      ${createSortList}
    </ul>`
  );
};

export default class SortView extends AbstractView {
  get template() {
    return createSortTemplate();
  }

  setSortTypeChangeHandler = (callback) => {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }
}
