import AbstractView from './abstract-view';

const createFilmCount = (films) => (
  `<p>
    ${films.length} movies inside
  </p>`
);

export default class FilmCountView extends AbstractView {
  #films = null;

  constructor(films) {
    super();
    this.#films = films;
  }

  get template() {
    return createFilmCount(this.#films);
  }
}
