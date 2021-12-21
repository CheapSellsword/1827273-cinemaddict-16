import { render, RenderPosition, appendChild, remove } from '../utils/render';
//import FilmCountView from './view/film-count-view';
//import FiltersAndStatsView from './view/filters-and-stats-view.js';
import SortView from '../view/sort-view';
//import ProfileRankAndAvatarView from './view/profile-and-rank-avatar-view';
import FilmsSectionView from '../view/films-section-view';
import FilmCardView from '../view/film-card-view';
import ShowMoreButtonView from '../view/show-more-button-view';
import FilmPopupView from '../view/film-popup-view';
import NoFilmView from '../view/no-film-view';
import { FILMS_COUNT_PER_STEP } from '../consts';
//import { createTopRatedFilmList, createMostCommentedFilmList } from '../mock/extra-films';

export default class BoardPresenter {
  #boardContainer = null;

  #filmSectionComponent = new FilmsSectionView();
  #showMoreButtonComponent = new ShowMoreButtonView();
  #noFilmComponent = new NoFilmView();
  #sortCompenent = new SortView();

  #boardFilms = [];
  #sectionFilms = [];
  #renderedFilmCardsCount = FILMS_COUNT_PER_STEP;
  #filmContainer = this.#filmSectionComponent.element.querySelector('.films-list__container');
  #topRatedSection = this.#filmSectionComponent.element.querySelector('.films-list--extra');
  #topRatedFilmContainer = this.#topRatedSection.querySelector('.films-list__container');
  #mostCommentedSection = this.#filmSectionComponent.element.querySelector('.films-list--extra:last-child');
  #mostCommentedFilmsContainer = this.#mostCommentedSection.querySelector('.films-list__container');


  constructor(boardContainer) {
    this.#boardContainer = boardContainer;
  }

  init = (boardFilms) => {
    this.#boardFilms = [...boardFilms];
    this.#renderFilmsSection(boardFilms);
  //  render(this.#boardContainer, this.#renderFilmsSection(boardFilms), RenderPosition.AFTER_END);
  }

  #renderFilm = (film) => {
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

    render(this.#filmContainer, filmComponent, RenderPosition.BEFORE_END);
  };

  #renderFilms = (from, to) => {
    this.#boardFilms
      .slice(from, to)
      .forEach((sectionFilm) => this.#renderFilm(sectionFilm));
  }

  #renderFilmList = () => {
    this.#renderFilms(0, this.#boardFilms.length);
    if (this.#boardFilms.length > FILMS_COUNT_PER_STEP) {
      this.#renderShowMoreButton();
    }
  }

  #renderNoFilm = () => {

  }

  #renderShowMoreButton = () => {

  }

  #renderFilmsSection = () => {
    if (this.#boardFilms.length) {
      render(this.#boardContainer, this.#sortCompenent, RenderPosition.BEFORE_BEGIN);
      this.#renderFilmList();
    } else {
      this.#renderNoFilm();
    }
    //this.#renderTopRatedFilms();
    //this.#renderMostCommentedFilms();
  }

  #renderPopup = () => {

  }
}

