import { render, RenderPosition, replace, remove } from '../utils/render.js';
import { FilterType, UpdateType } from '../consts.js';
import { filter } from '../utils/filters.js';
import FiltersAndStatsView from '../view/filters-and-stats-view.js';

export default class FilterPresenter {
  #filterContainer = null;
  #isStatsActive = null;
  #filterModel = null;
  #filmsModel = null;

  #filtersAndStatsComponent = null;

  constructor(filterContainer, filterModel, filmsModel) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#filmsModel = filmsModel;

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const films = this.#filmsModel.films;

    return [
      {
        type: FilterType.ALL,
        href: 'allMovies',
        name: 'All movies',
        count: filter[FilterType.ALL](films).length,
      },
      {
        type: FilterType.WATCHLIST,
        href: 'watchlist',
        name: 'Watchlist',
        count: filter[FilterType.WATCHLIST](films).length,
      },
      {
        type: FilterType.HISTORY,
        href: 'history',
        name: 'History',
        count: filter[FilterType.HISTORY](films).length,
      },
      {
        type: FilterType.FAVORITES,
        href: 'favorites',
        name: 'Favorites',
        count: filter[FilterType.FAVORITES](films).length,
      },
    ];
  }

  init = (isStatsActive) => {
    const filters = this.filters;
    const prevFilterComponent = this.#filtersAndStatsComponent;

    this.#filtersAndStatsComponent = new FiltersAndStatsView(filters, this.#filterModel.filter, isStatsActive);
    this.#filtersAndStatsComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);
    this.#filtersAndStatsComponent.setStatsClickHandler(this.#handleStatsClick);

    if (prevFilterComponent === null) {
      render(this.#filterContainer, this.#filtersAndStatsComponent, RenderPosition.BEFORE_END);
      return;
    }

    replace(this.#filtersAndStatsComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  #handleModelEvent = () => {
    this.init(this.#isStatsActive);
  }

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }
    this.#isStatsActive = false;
    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  #handleStatsClick = () => {
    this.#isStatsActive = true;
    this.#filterModel.showStats(UpdateType.STATS);
  }
}
