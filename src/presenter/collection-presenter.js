import { FILMS_COUNT_PER_STEP } from '../consts';
import { render, RenderPosition, appendChild, remove } from '../utils/render';
import { createTopRatedFilmList, createMostCommentedFilmList } from '../mock/extra-films';
import SortView from '../view/sort-view';
import FilmSectionView from '../view/film-section-view';
import ShowMoreButtonView from '../view/show-more-button-view';
import NoFilmView from '../view/no-film-view';
import FilmCardView from '../view/film-card-view';
import FilmPopupView from '../view/film-popup-view';


export default class CollectionPresenter {
  #collectionContainer = null;

  #sortComponent = new SortView();
  #filmSectionComponent = new FilmSectionView();
  #showMoreButtonComponent = new ShowMoreButtonView();
  #noFilmComponent = new NoFilmView();

  #collectionFilms = [];
  #renderedFilmCardsCount = FILMS_COUNT_PER_STEP;
  #filmContainer = this.#filmSectionComponent.element.querySelector('.films-list__container');
  #topRatedSection = this.#filmSectionComponent.element.querySelector('.films-list--extra');
  #topRatedFilmContainer = this.#topRatedSection.querySelector('.films-list__container');
  #mostCommentedSection = this.#filmSectionComponent.element.querySelector('.films-list--extra:last-child');
  #mostCommentedFilmsContainer = this.#mostCommentedSection.querySelector('.films-list__container');

  constructor(collectionContainer) {
    this.#collectionContainer = collectionContainer;
  }

  init = (collectionFilms) => {
    this.#collectionFilms = [...collectionFilms];
    this.#renderCollection(collectionFilms);
  }

  #renderFilm = (filmContainer, film) => {
    const filmComponent = new FilmCardView(film);
    const filmPopupComponent = new FilmPopupView(film);
    const body = document.querySelector('body');

    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        body.classList.remove('hide-overflow');
        remove(filmPopupComponent);
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const closePopupClickHandler = () => {
      body.classList.remove('hide-overflow');
      remove(filmPopupComponent);
      document.removeEventListener('keydown', escKeyDownHandler);
    };

    filmComponent.setCardClickHandler(() => {
      appendChild(body, filmPopupComponent);
      body.classList.add('hide-overflow');
      document.addEventListener('keydown', escKeyDownHandler);
      filmPopupComponent.setClosePopupClickHandler(closePopupClickHandler);
    });

    render(filmContainer, filmComponent, RenderPosition.BEFORE_END);
  };

  #renderFilms = (from, to) => {
    this.#collectionFilms
      .slice(from, to)
      .forEach((film) => this.#renderFilm(this.#filmContainer, film));
  }

  #renderFilmList = () => {
    this.#renderFilms(0, Math.min(this.#collectionFilms.length, this.#renderedFilmCardsCount));
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

  #renderShowMoreButton = () => {
    render(this.#filmContainer, this.#showMoreButtonComponent, RenderPosition.AFTER_END);
    this.#showMoreButtonComponent.setShowMoreButtonClickHandler(() => {
      this.#collectionFilms
        .slice(this.#renderedFilmCardsCount, this.#renderedFilmCardsCount + FILMS_COUNT_PER_STEP)
        .forEach((film) => this.#renderFilm(this.#filmContainer, film));

      this.#renderedFilmCardsCount += FILMS_COUNT_PER_STEP;

      if (this.#renderedFilmCardsCount >= this.#collectionFilms.length) {
        remove(this.#showMoreButtonComponent);
      }
    });
  }

  #renderTopRatedFilms = (collectionFilms) => {
    if (createTopRatedFilmList(collectionFilms)) {
      createTopRatedFilmList(collectionFilms).forEach((film) => this.#renderFilm(this.#topRatedFilmContainer, film));
    } else {
      this.#topRatedSection.remove();
    }
  }

  #renderMostCommentedFilms = (collectionFilms) => {
    if (createMostCommentedFilmList(collectionFilms)) {
      createMostCommentedFilmList(collectionFilms).forEach((film) => this.#renderFilm(this.#mostCommentedFilmsContainer, film));
    } else {
      this.#mostCommentedSection.remove();
    }
  }

  #renderNoFilm = () => {
    render(this.#collectionContainer, this.#noFilmComponent);
  }

  #renderCollection = () => {
    if (this.#collectionFilms.length) {
      this.#renderSort();
      this.#renderFilmSection();
      this.#renderFilmList();
      this.#renderTopRatedFilms(this.#collectionFilms);
      this.#renderMostCommentedFilms(this.#collectionFilms);
    } else {
      this.#renderNoFilm();
    }
  }

  #removePopup = () => {

  }
}


