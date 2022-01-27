import { FilterType, STATS_PERIODS, BAR_HEIGHT} from '../consts';
import { getFilmLengthTotal } from '../utils/dates-and-time';
import { createRank } from './profile-and-rank-avatar-view';
import { filter } from '../utils/filter';
import SmartView from './smart-view';
import isBetweenPlugin from 'dayjs/plugin/isBetween';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Chart from 'chart.js';
import dayjs from 'dayjs';

dayjs.extend(isBetweenPlugin);

const renderStatsChart = (statisticCtx, topGenres, filmCountsOfGenres) => {
  new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: topGenres,
      datasets: [{
        data: filmCountsOfGenres,
        backgroundColor: '#ffe800',
        hoverBackgroundColor: '#ffe800',
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
          color: '#ffffff',
          anchor: 'start',
          align: 'start',
          offset: 40,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#ffffff',
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

const getGenres = (films) => {
  if (!films.length) {
    return;
  }

  const genreAndFilms = {
    action: films.filter((film) => film.genres.find((genre) => genre === 'Action')),
    adventure: films.filter((film) => film.genres.find((genre) => genre === 'Adventure')),
    animation: films.filter((film) => film.genres.find((genre) => genre === 'Animation')),
    comedy: films.filter((film) => film.genres.find((genre) => genre === 'Comedy')),
    drama: films.filter((film) => film.genres.find((genre) => genre === 'Drama')),
    family: films.filter((film) => film.genres.find((genre) => genre === 'Family')),
    horror: films.filter((film) => film.genres.find((genre) => genre === 'Horror')),
    sciFi: films.filter((film) => film.genres.find((genre) => genre === 'Sci-Fi')),
    thriller: films.filter((film) => film.genres.find((genre) => genre === 'Thriller')),
  };

  return genreAndFilms;
};

const getTopGenres = (genres) => {
  if (!genres) {
    return;
  }

  const filmCountOfGenre = new Map(Object.entries(genres));
  const sortedGenresAndFilms = new Map([...filmCountOfGenre.entries()].sort((a, b) => b[1].length - a[1].length));
  const genreNames = [];
  Array.from(sortedGenresAndFilms.keys()).map((genre) => {
    let genreName = genre.charAt(0).toUpperCase() + genre.slice(1);
    if (genreName === 'SciFi') {
      genreName = 'Sci-Fi';
    }
    genreNames.push(genreName);
  });

  return genreNames;
};

const getFilmCountsOfGenres = (genres) => {
  if (!genres) {
    return [];
  }

  const filmCountOfGenres = new Map(Object.entries(genres));
  const sortedGenresAndFilms = new Map([...filmCountOfGenres.entries()].sort((a, b) => b[1].length - a[1].length));
  const filmCountsOfGenres = [];
  Array.from(sortedGenresAndFilms.values()).map((film) => {
    const filmCountOfGenre = film.length;
    filmCountsOfGenres.push(filmCountOfGenre);
  });
  return filmCountsOfGenres;
};

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
  const filmLengthTotal = getFilmLengthTotal(watchedFilms);
  const genres = getGenres(watchedFilms);
  const topGenres = getTopGenres(genres);
  getFilmCountsOfGenres(genres);


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
                <p class="statistic__item-text">${topGenres ? topGenres[0] : ''}</p>
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

   #setCharts = () => {
     const statisticCtx = this.element.querySelector('.statistic__chart');
     statisticCtx.height = BAR_HEIGHT * 9;
     const watchedFilms = getWatchedPeriodFilms(this._data);
     const genres = getGenres(watchedFilms);
     const topGenres = getTopGenres(genres);
     const filmCountsOfGenres = getFilmCountsOfGenres(genres);
     renderStatsChart(statisticCtx, topGenres, filmCountsOfGenres);
   }
}

