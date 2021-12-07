import { createElement } from '../render';

const createFilmCount = (films) => (
  `<p>
    ${films.length} movies inside
  </p>`
);

export default class FilmCountView {
  #element = null;
  #films = null;

  constructor(films) {
    this.#films = films;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createFilmCount(this.#films);
  }

  removeElement() {
    this.#element = null;
  }
}
