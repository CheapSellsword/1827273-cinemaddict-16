import AbstractObservable from '../utils/abstract-observable.js';
import { createTopRatedFilmList, createMostCommentedFilmList } from '../mock/extra-films.js';
import { EXTRA_FILMS_COUNT } from '../consts';

export default class FilmsModel extends AbstractObservable {
  #films = [];

  set films(films) {
    this.#films = [...films];
  }

  get films() {
    return this.#films;
  }

  get topRatedFilms() {
    return createTopRatedFilmList(this.#films).slice(0, EXTRA_FILMS_COUNT);
  }

  get mostCommentedFilms() {
    return createMostCommentedFilmList(this.#films).slice(0, EXTRA_FILMS_COUNT);
  }

}
