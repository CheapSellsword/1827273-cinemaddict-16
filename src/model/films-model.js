import AbstractObservable from '../utils/abstract-observable';
import { createTopRatedFilmList, createMostCommentedFilmList } from '../utils/common.js';
import { EXTRA_FILMS_COUNT, UpdateType } from '../consts';
import { convertMinutes } from '../utils/dates-and-time';
import dayjs from 'dayjs';

export const adaptToClient = (film) => {
  const adaptedFilm = {...film,
    cast: film['film_info']['actors'],
    ageRestriction:  film['film_info']['age_rating'],
    alternativeTitle:  film['film_info']['alternative_title'],
    description:  film['film_info']['description'],
    director:  film['film_info']['director'],
    genres:  film['film_info']['genre'],
    poster:  film['film_info']['poster'],
    fullReleaseDate:  dayjs(film['film_info']['release']['date']).format('DD MMMM YYYY'),
    releaseYear:  dayjs(film['film_info']['release']['date']).format('YYYY'),
    country:   film['film_info']['release']['release_country'],
    length: convertMinutes(film['film_info']['runtime']),
    title:  film['film_info']['title'],
    rating:  film['film_info']['total_rating'],
    writers:  film['film_info']['writers'],
    isOnWatchlist: film['user_details']['watchlist'],
    isWatched: film['user_details']['already_watched'],
    isFavorite: film['user_details']['favorite'],
    watchingDate: film['user_details']['watching_date'],
  };

  delete adaptedFilm['film_info'];
  delete adaptedFilm['user_details'];

  return adaptedFilm;
};

export default class FilmsModel extends AbstractObservable {
  #apiService = null;
  #commentsModel = null;
  #films = [];

  constructor(apiService, commentsModel) {
    super();
    this.#apiService = apiService;
    this.#commentsModel = commentsModel;
    this.#commentsModel.addObserver(this.#updateFilmComments);
  }

  init = async () => {
    try {
      const films = await this.#apiService.films;
      this.#films = films.map(adaptToClient);
    } catch (err) {
      this.#films = [];
    }
    this._notify(UpdateType.INIT);
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

  updateFilm = async (updateType, mode, update) => {
    const index = this.#films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }
    try {
      const response = await this.#apiService.updateFilm(update);
      const updatedFilm = adaptToClient(response);
      this.#films = [
        ...this.#films.slice(0, index),
        updatedFilm,
        ...this.#films.slice(index + 1),
      ];
      this._notify(updateType, mode, update);
    } catch (err) {
      throw new Error('Can\'t update film');
    }
  }

  #updateFilmComments = (updateType, mode, update) => {
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
