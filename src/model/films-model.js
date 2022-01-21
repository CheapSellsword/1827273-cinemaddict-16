import AbstractObservable from '../utils/abstract-observable.js';
import { createTopRatedFilmList, createMostCommentedFilmList } from '../mock/extra-films.js';
import { EXTRA_FILMS_COUNT } from '../consts';

export default class FilmsModel extends AbstractObservable {
  #commentsModel = null;
  #films = [];

  constructor(commentsModel) {
    super();
    this.#commentsModel = commentsModel;
    this.#commentsModel.addObserver(this.updateFilm);
  }

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

  updateFilm = (updateType, mode, update) => {
    const index = this.#films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    this.#films = [
      ...this.#films.slice(0, index),
      update,
      ...this.#films.slice(index + 1),
    ];

    this._notify(updateType, mode, update);
  }
}
