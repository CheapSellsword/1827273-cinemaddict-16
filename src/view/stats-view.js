import { FilterType, STATS_PERIODS } from '../consts';
import { createRank } from './profile-and-rank-avatar-view';
import { filter } from '../utils/filter';
import SmartView from './smart-view';
import dayjs from 'dayjs';
import isBetweenPlugin from 'dayjs/plugin/isBetween';

dayjs.extend(isBetweenPlugin);
// import ChartDataLabels from 'chartjs-plugin-datalabels';
// import Chart from 'chart.js';

const getWatchedPeriodFilms = (data) => {
  if (!data.pastDate) {
    return data.watchedFilms;
  }

  const filmsInRange = data.watchedFilms.filter((film) =>
    dayjs(film.watchingDate).isBetween(data.pastDate, data.currentDate));

  return filmsInRange;
};

const createPeriodItemTemplate = (period, isChecked) => (
  `<input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-${period.value}" value="${period.value}" ${isChecked ? 'checked' : ''}>
  <label for="statistic-${period.value}" class="statistic__filters-label">${period.name}</label>`
);

const createPeriodListTemplate = (checkedPeriod) => {
  const createPeriodList = STATS_PERIODS.map((period, index) => createPeriodItemTemplate(period, index === STATS_PERIODS.findIndex((statsPeriod) => statsPeriod.value === checkedPeriod))).join('');
  return createPeriodList;
};

const createStatsTemplate = (data, checkedPeriod) => {
  const watchedFilms = getWatchedPeriodFilms(data);

  return `<section class="statistic">
            <p class="statistic__rank">
                Your rank
                <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
                <span class="statistic__rank-label">${createRank(data.watchedFilms.length)}</span>
            </p>

            <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
                <p class="statistic__filters-description">Show stats:</p>
                ${createPeriodListTemplate(checkedPeriod)}
            </form>

            <ul class="statistic__text-list">
                <li class="statistic__text-item">
                <h4 class="statistic__item-title">You watched</h4>
                <p class="statistic__item-text">${watchedFilms.length} <span class="statistic__item-description">movies</span></p>
                </li>
                <li class="statistic__text-item">
                <h4 class="statistic__item-title">Total duration</h4>
                <p class="statistic__item-text">69 <span class="statistic__item-description">h</span> 41 <span class="statistic__item-description">m</span></p>
                </li>
                <li class="statistic__text-item">
                <h4 class="statistic__item-title">Top genre</h4>
                <p class="statistic__item-text">Drama</p>
                </li>
            </ul>

            <div class="statistic__chart-wrap">
                <canvas class="statistic__chart" width="1000"></canvas>
            </div>

          </section>`;
};

export default class StatsView extends SmartView {
  #checkedPeriod = 'all-time';

  constructor(films) {
    super();

    this._data = {
      watchedFilms: filter[FilterType.HISTORY](films),
      currentDate: dayjs(),
    };

    this.#setStatsPeriodListeners();
  }

  get template() {
    return createStatsTemplate(this._data, this.#checkedPeriod);
  }

  removeElement = () => {
    super.removeElement();
  }

  restoreHandlers = () => {
    this.#setCharts();
    this.#setStatsPeriodListeners();
  }

  #setStatsPeriodListeners = () => {
    this.element.querySelectorAll('.statistic__filters-input').forEach((period) => period.addEventListener('change', this.#periodChangeHandler));
  }

  #setCharts = () => {

  }

  #periodChangeHandler = (evt) => {
    evt.preventDefault();

    if (this.#checkedPeriod === evt.target.value) {
      return;
    }

    this.#checkedPeriod = evt.target.value;

    switch (this.#checkedPeriod) {
      case STATS_PERIODS[0].value:
        delete this._data.pastDate;
        break;
      case STATS_PERIODS[1].value:
        this._data.pastDate = this._data.currentDate.subtract(1, 'day');
        break;
      case STATS_PERIODS[2].value:
        this._data.pastDate = this._data.currentDate.subtract(1, 'week');
        break;
      case STATS_PERIODS[3].value:
        this._data.pastDate = this._data.currentDate.subtract(1, 'month');
        break;
      case STATS_PERIODS[4].value:
        this._data.pastDate = this._data.currentDate.subtract(1, 'year');
        break;
    }
    this.updateData(this._data);
  }
}
