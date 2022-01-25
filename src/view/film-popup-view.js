import { EvtKey, EMOJI_TYPES } from '../consts';
import { isBlank } from '../utils/common';
import SmartView from './smart-view';
import he from 'he';

const createFilmPopup = (data, comments) => {
  const {
    title,
    poster,
    fullReleaseDate,
    rating,
    length,
    genres,
    director,
    writers,
    cast,
    country,
    description,
    ageRestriction,
    isOnWatchlist,
    isWatched,
    isFavorite,
    emoji,
    text,
    checkedEmoji,
  } = data;
  const genreSuffix = genres.length > 1 ? 'Genres' : 'Genre';

  const createGenresTemplate = () => genres.map((genre) =>
    `<span class="film-details__genre">${genre || ''}</span>`
  ).join('');

  const createCommentsTemplate = () => comments.map((comment) =>
    `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="${comment.emoji}" width="55" height="55" alt="emoji-smile">
      </span>
      <div>
        <p class="film-details__comment-text">${he.encode(comment.text)}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${comment.author}</span>
          <span class="film-details__comment-day">${comment.date}</span>
          <button class="film-details__comment-delete" id=${comment.id}>Delete</button>
        </p>
      </div>
    </li>`
  ).join('');

  const watchlistClassName = isOnWatchlist
    ? 'film-details__control-button--active'
    : '';

  const watchedClassName = isWatched
    ? 'film-details__control-button--active'
    : '';

  const favoriteClassName = isFavorite
    ? 'film-details__control-button--active'
    : '';

  const createEmojiListItemTemplate = (emojiType) => `<input class="film-details__emoji-item visually-hidden" ${checkedEmoji === emojiType ? 'checked' : ''} name="comment-emoji" type="radio" id="emoji-${emojiType}" value="${emojiType}">
            <label class="film-details__emoji-label" for="emoji-${emojiType}">
              <img src="./images/emoji/${emojiType}.png" width="30" height="30" alt="${emojiType}">
            </label>`;

  const createEmojiListTemplate = () => {
    const createList = EMOJI_TYPES.map((emojiType) => createEmojiListItemTemplate(emojiType)).join('');

    return `<div class="film-details__emoji-list">
              ${createList}
            </div>`;
  };

  return `<section class="film-details">
            <form class="film-details__inner" action="" method="get">
              <div class="film-details__top-container">
                <div class="film-details__close">
                  <button class="film-details__close-btn" type="button">close</button>
                </div>
                <div class="film-details__info-wrap">
                  <div class="film-details__poster">
                    <img class="film-details__poster-img" src="${poster}" alt="">

                    <p class="film-details__age">${ageRestriction}</p>
                  </div>

                  <div class="film-details__info">
                    <div class="film-details__info-head">
                      <div class="film-details__title-wrap">
                        <h3 class="film-details__title">${title}</h3>
                        <p class="film-details__title-original">Original: ${title}</p>
                      </div>

                      <div class="film-details__rating">
                        <p class="film-details__total-rating">${rating}</p>
                      </div>
                    </div>

                    <table class="film-details__table">
                      <tr class="film-details__row">
                        <td class="film-details__term">Director</td>
                        <td class="film-details__cell">${director}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Writers</td>
                        <td class="film-details__cell">${writers}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Actors</td>
                        <td class="film-details__cell">${cast}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Release Date</td>
                        <td class="film-details__cell">${fullReleaseDate}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Runtime</td>
                        <td class="film-details__cell">${length}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Country</td>
                        <td class="film-details__cell">${country}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">${genreSuffix}</td>
                        <td class="film-details__cell">
                          ${createGenresTemplate()}</td>
                      </tr>
                    </table>

                    <p class="film-details__film-description">
                      ${description}
                    </p>
                  </div>
                </div>

                <section class="film-details__controls">
                  <button type="button" class="film-details__control-button ${watchlistClassName} film-details__control-button--watchlist" id="watchlist" name="watchlist">Add to watchlist</button>
                  <button type="button" class="film-details__control-button ${watchedClassName} film-details__control-button--watched" id="watched" name="watched">Already watched</button>
                  <button type="button" class="film-details__control-button ${favoriteClassName} film-details__control-button--favorite ${favoriteClassName}" id="favorite" name="favorite">Add to favorites</button>
                </section>
              </div>

              <div class="film-details__bottom-container">
                <section class="film-details__comments-wrap">
                  <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

                  <ul class="film-details__comments-list">
                  ${createCommentsTemplate()}
                  </ul>

                  <div class="film-details__new-comment">
                    <div class="film-details__add-emoji-label">${emoji}</div>

                    <label class="film-details__comment-label">
                      <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${he.encode(text)}</textarea>
                    </label>
                    ${createEmojiListTemplate()}
                    </div>
                  </div>
                </section>
              </div>
            </form>
          </section>`;
};

export default class FilmPopupView extends SmartView {
  #popupListeners = null;
  #comments = null;
  #newComment = {};

  constructor(film, comments, addPopupListeners) {
    super();
    this.#popupListeners = addPopupListeners;
    this.#comments = comments;
    this._data = FilmPopupView.parseFilmToData(film);
    this.#setInnerHandlers();
  }

  get template() {
    return createFilmPopup(this._data, this.#comments);
  }

  set scrollPosition(position) {
    this.element.scrollTop = position;
  }

  get scrollPosition() {
    return this.element.scrollTop;
  }

  reset = (film) => {
    this.updateData(
      FilmPopupView.parseFilmToData(film),
    );
    this.#newComment = {};
  }

  setClosePopupClickHandler = (callback) => {
    this._callback.closePopupClick = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#closePopupClickHandler);
  }

  setWatchlistClickHandler = (callback) => {
    this._callback.watchlistClick = callback;
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#watchlistClickHandler);
  }

  setWatchedClickHandler = (callback) => {
    this._callback.watchedClick = callback;
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#watchedClickHandler);
  }

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#favoriteClickHandler);
  }

  restoreHandlers = () => {
    this.#setInnerHandlers();
    this.#popupListeners();
  }

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    document.addEventListener('keydown', this.#formSubmitHandler);
  }

  setCommentDeleteClickHandler = (callback) => {
    this._callback.commentDelete = callback;
    this.element.querySelectorAll('.film-details__comment-delete').forEach((button) => button.addEventListener('click', this.#commentDeleteClickHandler));
  }

  removeFormSubmitHandler = () => {
    document.removeEventListener('keydown', this._callback.formSubmit);
    document.removeEventListener('keydown',  this.#formSubmitHandler);
  }

  #setInnerHandlers = () => {
    this.element.querySelectorAll('.film-details__emoji-item').forEach((emoji) => emoji.addEventListener('change', this.#emojiChangeHandler));
    this.element.querySelector('.film-details__comment-input').addEventListener('input', this.#commentInputHandler);
    this.setCommentDeleteClickHandler(this._callback.commentDelete);
  }

  #emojiChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateData({
      emoji: `<img src="images/emoji/${evt.target.value}.png" width="55" height="55" alt="emoji-${evt.target.value}">`,
      checkedEmoji: evt.target.value,
    });
    this.#newComment.emoji = evt.target.value;
  }

  #commentInputHandler = (evt) => {
    evt.preventDefault();
    this.updateDataOnly({
      text: evt.target.value,
    },true);
    this.#newComment.text = evt.target.value;
  }

  #commentDeleteClickHandler = (evt) => {
    evt.preventDefault();
    const commentToDelete = this.#comments.find((comment) => comment.id === evt.target.id);
    this._callback.commentDelete(commentToDelete);
  }

  #closePopupClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.closePopupClick();
  }

  #watchlistClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchlistClick();
  }

  #watchedClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchedClick();
  }

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  }


  #formSubmitHandler = (evt) => {
    if (evt.key === EvtKey.ENTER && (evt.ctrlKey || evt.metaKey)) {
      evt.preventDefault();
      if (isBlank(this.#newComment.emoji) || isBlank(this.#newComment.text)) {
        return;
      }
      this._callback.formSubmit(this.#newComment);
      this.#newComment = {};
      this.removeFormSubmitHandler();
    }
  };

  static parseFilmToData = (film) => ({...film,
    emoji: '',
    text: '',
    checkedEmoji: '',
  })

  static parseDataToFilm = (data) => {
    const film = {...data};

    film.emoji = '';
    film.text = '';
    film.checkedEmoji = '';

    delete film.emoji;
    delete film.text;
    delete film.checkedEmoji;

    return film;
  }
}
