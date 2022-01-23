import AbstractView from './abstract-view';

const createFilterItemTemplate = (filter, currentFilterType) =>  {
  const {type, href, name, count} = filter;

  const activeClass = type === currentFilterType ? 'main-navigation__item--active' : '';

  if (name === 'All movies') {
    return `<a href="#${href}" class="main-navigation__item ${activeClass}" data-filter-type="${type}">${name}</a>`;
  }
  return `<a href="#${href}" class="main-navigation__item ${activeClass}" data-filter-type="${type}">${name} <span class="main-navigation__item-count">${count}</span></a>`;
};

const createFiltersAndStatsTemplate = (filters, currentFilter, isStatsActive) => {
  const isActive = isStatsActive ? 'main-navigation__item--active' : '';

  const createFilterList = filters.map((filter) => createFilterItemTemplate(filter, currentFilter)).join('');

  return `<nav class="main-navigation">
            <div class="main-navigation__items">
              ${createFilterList}
            </div>
            <a href="#stats" class="main-navigation__additional ${isActive}">Stats</a>
          </nav>`;
};

export default class FiltersAndStatsView extends AbstractView {
  #filters = null;
  #isStatsActive = null;
  #currentFilter = null;

  constructor (filters, currentFilterType, isStatsActive) {
    super();
    this.#filters = filters;
    this.#isStatsActive = isStatsActive;
    this.#currentFilter = currentFilterType;
  }

  get template() {
    return createFiltersAndStatsTemplate(this.#filters, this.#currentFilter, this.#isStatsActive);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.querySelectorAll('.main-navigation__item').forEach((filter) => filter.addEventListener('click', this.#filterTypeChangeHandler));
  }

  setStatsClickHandler = (callback) => {
    this._callback.statsClick = callback;
    this.element.querySelector('.main-navigation__additional').addEventListener('click', this.#statsClickHandler);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.closest('[data-filter-type]').dataset.filterType);
    this.element.querySelector('.main-navigation__additional').classList.remove('main-navigation__item--active');
  }

  #statsClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.statsClick();
  }
}

