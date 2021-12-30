import { FILMS_COUNT_PER_STEP } from '../consts';
import { render, RenderPosition, remove, appendChild } from '../utils/render';
import SortView from '../view/sort-view';
import FilmSectionView from '../view/film-section-view';
import ShowMoreButtonView from '../view/show-more-button-view';
import NoFilmView from '../view/no-film-view';
import FilmCardView from '../view/film-card-view';
import FilmPopupView from '../view/film-popup-view';

export default class CollectionPresenter {
  #collectionContainer = null;
  #popupComponent = null;

  #sortComponent = new SortView();
  #filmSectionComponent = new FilmSectionView();
  #showMoreButtonComponent = new ShowMoreButtonView();
  #noFilmComponent = new NoFilmView();

  #collectionFilms = [];

  #body = document.querySelector('body');
  #renderedFilmCardsCount = FILMS_COUNT_PER_STEP;
  #filmContainer = this.#filmSectionComponent.filmContainer;

  constructor(collectionContainer) {
    this.#collectionContainer = collectionContainer;
  }

  init = (collectionFilms) => {
    this.#collectionFilms = [...collectionFilms];
    this.#renderCollection();
  }

  #renderFilm = (filmContainer, film) => {
    const filmComponent = new FilmCardView(film);

    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        this.#body.classList.remove('hide-overflow');
        remove(this.#popupComponent);
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const closePopupClickHandler = () => {
      this.#body.classList.remove('hide-overflow');
      remove(this.#popupComponent);
      document.removeEventListener('keydown', escKeyDownHandler);
    };

    filmComponent.setFilmCardClickHandler(() => {
      if(this.#popupComponent !== null) {
        remove(this.#popupComponent);
      }
      this.#popupComponent = new FilmPopupView(film);
      appendChild(this.#body, this.#popupComponent);
      this.#body.classList.add('hide-overflow');
      document.addEventListener('keydown', escKeyDownHandler);
      this.#popupComponent.setClosePopupClickHandler(closePopupClickHandler);
    });

    render(filmContainer, filmComponent, RenderPosition.BEFORE_END);
  }

  #renderFilms = (films, from, to, filmContainer) => {
    films
      .slice(from, to)
      .forEach((film) => this.#renderFilm(filmContainer, film));
  }

  #renderFilmList = () => {
    this.#renderFilms(this.#collectionFilms, 0, Math.min(this.#collectionFilms.length, this.#renderedFilmCardsCount), this.#filmContainer);
    if (this.#collectionFilms.length > FILMS_COUNT_PER_STEP) {
      this.#renderShowMoreButton();
    }
  }

  #renderSort = () => {
    render(this.#collectionContainer, this.#sortComponent, RenderPosition.BEFORE_END);
  }

  #renderFilmSection = () => {
    render(this.#collectionContainer, this.#filmSectionComponent, RenderPosition.BEFORE_END);
  }

  #handleShowMoreButtonClick = () => {
    this.#renderFilms(this.#collectionFilms, this.#renderedFilmCardsCount, this.#renderedFilmCardsCount + FILMS_COUNT_PER_STEP, this.#filmContainer);
    this.#renderedFilmCardsCount += FILMS_COUNT_PER_STEP;
    if (this.#renderedFilmCardsCount >= this.#collectionFilms.length) {
      remove(this.#showMoreButtonComponent);
    }
  }

  #renderShowMoreButton = () => {
    render(this.#filmContainer, this.#showMoreButtonComponent, RenderPosition.AFTER_END);
    this.#showMoreButtonComponent.setShowMoreButtonClickHandler(this.#handleShowMoreButtonClick);
  }

  #renderNoFilm = () => {
    render(this.#collectionContainer, this.#noFilmComponent);
  }

  #renderCollection = () => {
    if (this.#collectionFilms.length) {
      this.#renderSort();
      this.#renderFilmSection();
      this.#renderFilmList();
    } else {
      this.#renderNoFilm();
    }
  }
}
