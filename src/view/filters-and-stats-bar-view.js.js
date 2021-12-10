import { createElement } from '../render';

const createFilterItemTemplate = (filter, isActive) =>  {
  const activeClass = isActive ? 'main-navigation__item--active' : '';

  if (filter.name === 'All movies') {
    return `<a href="#${filter.href}" class="main-navigation__item ${activeClass ? 'main-navigation__item--active'  : ''}">${filter.name}</a>`;
  }
  return `<a href="#${filter.href}" class="main-navigation__item ${activeClass ? 'main-navigation__item--active'  : ''}">${filter.name} <span class="main-navigation__item-count">${filter.count}</span></a>`;
};

const createFiltersAndStatsBar = (filters) => {
  const createFilterList = filters.map((filter, index) => createFilterItemTemplate(filter, index === 0)).join('');

  return `<nav class="main-navigation">
            <div class="main-navigation__items">
              ${createFilterList}
            </div>
            <a href="#stats" class="main-navigation__additional">Stats</a>
          </nav>`;
};

export default class FiltersAndStatsBarView {
  #element = null;
  #filters = null;

  constructor (filters) {
    this.#filters = filters;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createFiltersAndStatsBar(this.#filters);
  }

  removeElement() {
    this.#element = null;
  }
}
