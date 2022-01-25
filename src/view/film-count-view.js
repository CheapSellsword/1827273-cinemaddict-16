import SmartView from './smart-view';

const createFilmCount = (filmsCount) => (
  `<p>
    ${filmsCount} movies inside
  </p>`
);

export default class FilmCountView extends SmartView {
  #filmsModel
  #films = [];

  constructor(filmsModel) {
    super();
    this.#filmsModel = filmsModel;
    this.#filmsModel.addObserver(this.#handleModelEvent);
  }

  get template() {
    return createFilmCount(this.#films.length);
  }

  restoreHandlers = () => {};

  #handleModelEvent = () => {
    this.#films = this.#filmsModel.films;
    this.updateElement();
    this.#filmsModel.removeObserver(this.#handleModelEvent);
  }
}
