import AbstractView from './abstract-view';

const createFilterItemTemplate = (filter, isActive) =>  {
  const activeClass = isActive ? 'main-navigation__item--active' : '';

  if (filter.name === 'All movies') {
    return `<a href="#${filter.href}" class="main-navigation__item ${activeClass ? 'main-navigation__item--active'  : ''}">${filter.name}</a>`;
  }
  return `<a href="#${filter.href}" class="main-navigation__item ${activeClass ? 'main-navigation__item--active'  : ''}">${filter.name} <span class="main-navigation__item-count">${filter.count}</span></a>`;
};

const createFiltersAndStatsTemplate = (filters) => {
  const createFilterList = filters.map((filter, index) => createFilterItemTemplate(filter, index === 0)).join('');

  return `<nav class="main-navigation">
            <div class="main-navigation__items">
              ${createFilterList}
            </div>
            <a href="#stats" class="main-navigation__additional">Stats</a>
          </nav>`;
};

export default class FiltersAndStatsView extends AbstractView {
  #filters = null;

  constructor(filters) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createFiltersAndStatsTemplate(this.#filters);
  }
}
