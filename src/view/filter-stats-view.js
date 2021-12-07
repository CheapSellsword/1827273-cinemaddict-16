import { createElement } from '../render';

const createFiltersAndStatsBar = (filters, isChecked) => {
  const filterClassName = isChecked
    ? 'main-navigation__item--active'
    : '';

  const createFiltersTemplate = () => filters.map((filter) => {
    if(filter.name === 'All movies') {
      return `<a href="#${filter.href}" class="main-navigation__item ${filterClassName}">${filter.name}</a>`;
    }
    return `<a href="#${filter.href}" class="main-navigation__item ${filterClassName}">${filter.name} <span class="main-navigation__item-count">${filter.count}</span></a>`;
  }).join('');

  return `<nav class="main-navigation">
          <div class="main-navigation__items">
           ${createFiltersTemplate()}
          </div>
          <a href="#stats" class="main-navigation__additional">Stats</a>
        </nav>`;
};

export default class FiltersAndStatsBarView {
  #element = null;
  #filters = null;
  #isChecked = null;

  constructor (filters, isChecked) {
    this.#filters = filters;
    this.#isChecked = isChecked;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createFiltersAndStatsBar(this.#filters, this.#isChecked);
  }

  removeElement() {
    this.#element = null;
  }
}
