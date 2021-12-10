import { createElement } from '../render';
import { SORT_TYPES } from '../consts';

const createSortItemTemplate = (type, isActive) => {
  const activeClass = isActive ? 'sort__button--active' : '';

  return (
    `<li>
      <a href="${type}" class="sort__button ${activeClass}">Sort by ${type}</a>
    </li>`
  );
};

const createSortTemplate = () => {
  const createSortList = SORT_TYPES.map((sortElement, index) => createSortItemTemplate(sortElement, index === 0)).join('');
  return (
    `<ul class ="sort">
      ${createSortList}
    </ul>`
  );
};

export default class SortView {
    #element = null;

    get element() {
      if (!this.#element) {
        this.#element = createElement(this.template);
      }

      return this.#element;
    }

    get template() {
      return createSortTemplate();
    }

    removeElement() {
      this.#element = null;
    }
}
