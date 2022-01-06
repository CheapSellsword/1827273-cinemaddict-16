import AbstractView from './abstract-view';
import { SORT_TYPES } from '../consts';

const createSortItemTemplate = (type, isActive) => {
  const activeClass = isActive ? 'sort__button--active' : '';

  return (
    `<li>
    <a href="${type}" class="sort__button ${activeClass}" data-sort-type="${type}">Sort by ${type}</a>
    </li>`
  );
};

const createSortTemplate = (activeSort) => {
  const sortTypes = Object.values(SORT_TYPES);
  const createSortList =  sortTypes.map((sortElement, index) => createSortItemTemplate(sortElement, index === sortTypes.indexOf(activeSort))).join('');
  return (
    `<ul class ="sort">
      ${createSortList}
    </ul>`
  );
};

export default class SortView extends AbstractView {
  #activeSort = 'default';

  get template() {
    return createSortTemplate(this.#activeSort);
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
    this.#activeSort = evt.target.dataset.sortType;
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }
}
