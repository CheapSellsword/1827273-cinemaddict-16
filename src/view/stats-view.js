import { FilterType, STATS_PERIODS, BAR_HEIGHT, GENRES_COUNT, StatsPeriod, Color } from '../consts';
import { getFilmLengthTotal, NameToDate } from '../utils/dates-and-time';
import { filter, statsFilter } from '../utils/filters';
import { createRank } from './profile-and-rank-avatar-view';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import isBetweenPlugin from 'dayjs/plugin/isBetween';
import SmartView from './smart-view';
import Chart from 'chart.js';
import dayjs from 'dayjs';

dayjs.extend(isBetweenPlugin);

const renderStatsChart = (statisticCtx, sortedGenres, sortedFilmCounts) => {
  new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: sortedGenres,
      datasets: [{
        data: sortedFilmCounts,
        backgroundColor: Color.YELLOW,
        hoverBackgroundColor: Color.YELLOW,
        anchor: 'start',
        barThickness: 24,
      }],
    },
    options: {
      responsive: false,
      plugins: {
        datalabels: {
          font: {
            size: 20,
          },
          color: Color.WHITE,
          anchor: 'start',
          align: 'start',
          offset: 40,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: Color.WHITE,
            padding: 100,
            fontSize: 20,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const getFilmsOfGenre = (films) => {
  if (!films.length) {
    return;
  }
  const collectedGenres = [];
  films.map((film) => {
    collectedGenres.push(film.genres);
  });

  const filmsOfGenre = collectedGenres.flat().reduce((total, genre) => {
    if (!total[genre]) {
      total[genre] = 1;
    } else {
      total[genre] = total[genre] + 1;
    }
    return total;
  }, {});
  return filmsOfGenre;
};

const getTopGenres = (filmsOfGenre) => {
  if (!filmsOfGenre) {
    return [];
  }
  const sortedGenres = Object.keys(filmsOfGenre).sort((a, b) => filmsOfGenre[b] - filmsOfGenre[a]);
  return sortedGenres;
};

const getGenreFilmCounts = (filmsOfGenre) => {
  if (!filmsOfGenre) {
    return [];
  }
  const sortedFilmCounts = Object.values(filmsOfGenre).sort((a, b) => b - a);
  return sortedFilmCounts;
};


const getWatchedPeriodFilms = (data) => {
  if (!data.pastDate) {
    return data.watchedFilms;
  }

  switch (data.pastDate) {
    case NameToDate.TODAY:
      return statsFilter[StatsPeriod.TODAY](data.watchedFilms);
    case NameToDate.WEEK:
      return statsFilter[StatsPeriod.WEEK](data.watchedFilms);
    case NameToDate.MONTH:
      return statsFilter[StatsPeriod.MONTH](data.watchedFilms);
    case NameToDate.YEAR:
      return statsFilter[StatsPeriod.YEAR](data.watchedFilms);
  }
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
  const filmLengthTotal = getFilmLengthTotal(watchedFilms);
  const filmsOfGenre = getFilmsOfGenre(watchedFilms);
  const topGenre = getTopGenres(filmsOfGenre)[0];

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
                <p class="statistic__item-text">${filmLengthTotal.hours} <span class="statistic__item-description">h</span> ${filmLengthTotal.minutes} <span class="statistic__item-description">m</span></p>
                </li>
                <li class="statistic__text-item">
                <h4 class="statistic__item-title">Top genre</h4>
                <p class="statistic__item-text">${topGenre ? topGenre : ''}</p>
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
    };

    this.#setStatsPeriodListeners();
    this.#setCharts();
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

  #periodChangeHandler = (evt) => {
    evt.preventDefault();

    if (this.#checkedPeriod === evt.target.value) {
      return;
    }

    this.#checkedPeriod = evt.target.value;

    switch (this.#checkedPeriod) {
      case StatsPeriod.ALL:
        delete this._data.pastDate;
        break;
      case StatsPeriod.TODAY:
        this._data.pastDate = NameToDate.TODAY;
        break;
      case StatsPeriod.WEEK:
        this._data.pastDate = NameToDate.WEEK;
        break;
      case StatsPeriod.MONTH:
        this._data.pastDate = NameToDate.MONTH;
        break;
      case StatsPeriod.YEAR:
        this._data.pastDate = NameToDate.YEAR;
        break;
    }
    this.updateData(this._data);
  }

   #setCharts = () => {
     const statisticCtx = this.element.querySelector('.statistic__chart');
     statisticCtx.height = BAR_HEIGHT * GENRES_COUNT;
     const watchedFilms = getWatchedPeriodFilms(this._data);
     const filmsOfGenre = getFilmsOfGenre(watchedFilms);
     const sortedGenres = getTopGenres(filmsOfGenre);
     const sortedFilmCounts = getGenreFilmCounts(filmsOfGenre);
     renderStatsChart(statisticCtx, sortedGenres, sortedFilmCounts);
   }
}

