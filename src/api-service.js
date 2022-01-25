import { Method } from './consts';
import { getFilmLengthInMinutes } from './utils/dates-and-time';
import dayjs from 'dayjs';

export default class ApiService {
    #endPoint = null;
    #authorization = null;

    constructor (endPoint, authorization) {
      this.#endPoint = endPoint;
      this.#authorization = authorization;
    }

    get films() {
      return this.#load({url: 'movies'})
        .then(ApiService.parseResponse);
    }

    updateFilm = async (film) => {
      const response = await this.#load({
        url: `movies/${film.id}`,
        method: Method.PUT,
        body: JSON.stringify(film),
        headers: new Headers({'Content-Type': 'application/json'}),
      });

      const parsedResponse = await ApiService.parseResponse(response);

      return parsedResponse;
    }

  #load = async ({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers(),
  }) => {
    headers.append('Authorization', this.#authorization);

    const response = await fetch(
      `${this.#endPoint}/${url}`,
      {method, body, headers},
    );

    try {
      ApiService.checkStatus(response);
      return response;
    } catch (err) {
      ApiService.catchError(err);
    }
  }

  #adaptFilmToServer = (film) => {
    const adaptedFilm = {...film,
      'film_info': {
        'actors': film.cast,
        'age_rating': film.ageRestriction,
        'alternative_title': film.alternativeTitle,
        'description': film.description,
        'director': film.director,
        'genre': film.genres,
        'poster': film.poster,
        'runtime': getFilmLengthInMinutes(film.length),
        'title': film.title,
        'total_rating': film.rating,
        'writers': film.writers,
        'release': {
          'date': dayjs(film.fullReleaseDate).toISOString(),
          'release_country': film.country,
        }
      },
      'user_details': {
        'watchlist': film.isOnWatchlist,
        'already_watched': film.isWatched,
        'watching_date': film.watchingDate,
        'favorite': film.isFavorite,
      }
    };

    delete adaptedFilm.cast;
    delete adaptedFilm.ageRestriction;
    delete adaptedFilm.alternativeTitle;
    delete adaptedFilm.description;
    delete adaptedFilm.director;
    delete adaptedFilm.genres;
    delete adaptedFilm.poster;
    delete adaptedFilm.length;
    delete adaptedFilm.title;
    delete adaptedFilm.rating;
    delete adaptedFilm.writers;
    delete adaptedFilm.fullReleaseDate;
    delete adaptedFilm.releaseYear;
    delete adaptedFilm.country;
    delete adaptedFilm.isOnWatchlist;
    delete adaptedFilm.isWatched;
    delete adaptedFilm.isFavorite;
    delete adaptedFilm.watchingDate;

    return adaptedFilm;
  }

  #adaptCommentToServer = (newComment) => {
    const adaptedComment = {...newComment,
      comment: newComment.text,
      emotion: newComment.emoji,
    };

    delete adaptedComment.text;
    delete adaptedComment.emoji;

    return adaptedComment;
  };

  static parseResponse = (response) => response.json();

  static checkStatus = (response) => {
    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  }

  static catchError = (err) => {
    throw err;
  }
}
