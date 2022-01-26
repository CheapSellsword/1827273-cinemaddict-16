import { FilterType, STATS_PERIODS } from '../consts';
import { createRank } from './profile-and-rank-avatar-view';
import { filter } from '../utils/filter';
import SmartView from './smart-view';
// import ChartDataLabels from 'chartjs-plugin-datalabels';
// import Chart from 'chart.js';

const createPeriodItemTemplate = (period, isChecked) => (
  `<input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-${period.value}" value="${period.value}" ${isChecked ? 'checked' : ''}>
  <label for="statistic-${period.value}" class="statistic__filters-label">${period.name}</label>`
);

const createPeriodListTemplate = (checkedPeriod) => {
  const createPeriodList = STATS_PERIODS.map((period, index) => createPeriodItemTemplate(period, index === STATS_PERIODS.findIndex((statsPeriod) => statsPeriod.value === checkedPeriod))).join('');
  return createPeriodList;
};

const createStatsTemplate = (watchedFilms, checkedPeriod) => {
  const rank = createRank(watchedFilms.length);
  const periodList = createPeriodListTemplate(checkedPeriod);

  return `<section class="statistic">
            <p class="statistic__rank">
                Your rank
                <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
                <span class="statistic__rank-label">${rank}</span>
            </p>

            <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
                <p class="statistic__filters-description">Show stats:</p>
                ${periodList}
            </form>

            <ul class="statistic__text-list">
                <li class="statistic__text-item">
                <h4 class="statistic__item-title">You watched</h4>
                <p class="statistic__item-text">28 <span class="statistic__item-description">movies</span></p>
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

    this._data = filter[FilterType.HISTORY](films);
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

  #periodChangeHandler = (evt) => {
    evt.preventDefault();

  }

  #setStatsPeriodListeners = () => {
    this.element.querySelectorAll('.statistic__filters-input').forEach((period) => period.addEventListener('change', this.#periodChangeHandler));
  }

  #setCharts = () => {

  }

}
