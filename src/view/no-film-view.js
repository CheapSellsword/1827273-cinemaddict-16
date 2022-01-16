import AbstractView from './abstract-view';
import { FilterType } from '../consts';

const NoFilmTextType = {
  [FilterType.ALL]: 'There are no movies in our database',
  [FilterType.WATCHLIST]: 'There are no movies to watch now',
  [FilterType.HISTORY]: 'There are no watched movies now',
  [FilterType.FAVORITES]: 'There are no favorite movies now',
};

const createNoFilmTemplate = (filterType) => {
  const noFilmTextValue = NoFilmTextType[filterType];

  return (
    `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title">${noFilmTextValue}</h2>
    </section>
  </section>`
  );
};

export default class NoFilmView extends AbstractView {
  constructor(data) {
    super();
    this._data = data;
  }

  get template() {
    return createNoFilmTemplate(this._data);
  }
}
