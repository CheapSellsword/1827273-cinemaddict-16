import { createElement } from '../render';

const createSortItemTemplate = (type, isActive) => {
  const activeClass = isActive ? 'sort__button--active' : '';

  return (
    `<li>
      <a href="${type}" class="sort__button ${activeClass}">Sort by ${type}</a>
    </li>`
  );
};

const sortTypesArray = [
  'date',
  'rating',
  'default',
];

const createSortTemplate = () => sortTypesArray.map((type) => createSortItemTemplate(type));

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
