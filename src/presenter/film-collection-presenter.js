import { FILMS_COUNT_PER_STEP, EXTRA_FILMS_COUNT, SortType, UpdateType, UserAction } from '../consts';
import { render, RenderPosition, remove } from '../utils/render';
import { compareByField } from '../utils/common';
import ShowMoreButtonView from '../view/show-more-button-view';
import FilmSectionView from '../view/film-section-view';
import FilmPresenter from './film-presenter';
import NoFilmView from '../view/no-film-view';
import SortView from '../view/sort-view';

export default class FilmCollectionPresenter {
    #filmListContainer = null;
    #filmsModel = null;

    #sortComponent = new SortView();
    #noFilmComponent = new NoFilmView();
    #filmSectionComponent = new FilmSectionView();
    #showMoreButtonComponent = new ShowMoreButtonView();

    #presenters = [];
    #currentSortType = SortType.DEFAULT;
    #renderedFilmCount = FILMS_COUNT_PER_STEP;
    #filmContainer = this.#filmSectionComponent.filmContainer;
    #topRatedSection = this.#filmSectionComponent.topRatedSection;
    #mostCommentedSection = this.#filmSectionComponent.mostCommentedSection;
    #topRatedFilmContainer = this.#filmSectionComponent.topRatedFilmContainer;
    #mostCommentedFilmContainer = this.#filmSectionComponent.mostCommentedFilmContainer;
    #body = document.querySelector('body');

    constructor(filmCollectionContainer, filmsModel) {
      this.#filmListContainer = filmCollectionContainer;
      this.#filmsModel = filmsModel;

      this.#filmsModel.addObserver(this.#handleModelEvent);
    }

    get films() {
      const films = this.#filmsModel.films;

      switch (this.#currentSortType) {
        case SortType.DATE:
          return films.sort(compareByField('releaseYear'));
        case SortType.RATING:
          return films.sort(compareByField('rating'));
      }
      return films;
    }

    get topRatedFilms() {
      return this.#filmsModel.topRatedFilms;
    }

    get mostCommentedFilms() {
      return this.#filmsModel.mostCommentedFilms;
    }

    init = () => {
      this.#renderFilmCollection();
    }

    #handleViewAction = (actionType, updateType, update) => {
      switch (actionType) {
        case UserAction.UPDATE_FILM:
          this.#filmsModel.updateFilm(updateType, update);
          break;
      }
    }

    #handleModelEvent = (updateType, data) => {
      switch (updateType) {
        case UpdateType.PATCH:
          this.#presenters.forEach((presenter) => {
            if (presenter.id === data.id) {
              presenter.init(data);
            }
          });
          break;
        case UpdateType.MINOR:

          break;
        case UpdateType.MAJOR:

          break;
      }
    }

    #handleShowMoreButtonClick = () => {
      const filmCount = this.films.length;
      const newRenderedFilmCount = Math.min(filmCount, this.#renderedFilmCount + FILMS_COUNT_PER_STEP);
      const films = this.films.slice(this.#renderedFilmCount, newRenderedFilmCount);

      this.#renderFilms(films, this.#filmContainer);
      this.#renderedFilmCount = newRenderedFilmCount;

      if (this.#renderedFilmCount >= filmCount) {
        remove(this.#showMoreButtonComponent);
      }
    }

    #handleModeChange = () => {
      this.#presenters.forEach((presenter) => presenter.closePopup());
    }

    #handleSortTypeChange = (sortType) => {
      if (this.#currentSortType === sortType) {
        return;
      }
      this.#body.classList.remove('hide-overflow');
      this.#currentSortType = sortType;
      this.#clearFilmSection();
      this.#renderFilmSort();
      this.#renderFilmSection();
      this.#renderFilmList();
      this.#renderExtraFilms(this.#topRatedFilmContainer, this.topRatedFilms, this.#topRatedSection);
      this.#renderExtraFilms(this.#mostCommentedFilmContainer, this.mostCommentedFilms, this.#mostCommentedSection);
    }

    #clearFilmSection = () => {
      remove(this.#sortComponent);
      this.#presenters.forEach((presenter) => presenter.destroy());
      this.#presenters = [];
      this.renderedFilmsCount = FILMS_COUNT_PER_STEP;
      remove(this.#showMoreButtonComponent);
    }

    #clearFilmCollection = () => {
      remove(this.#sortComponent);
      remove(this.#filmSectionComponent);
      remove(this.#showMoreButtonComponent);
      this.renderedFilmsCount = 0;
    }

    #renderFilmSort = () => {
      render(this.#filmListContainer, this.#sortComponent, RenderPosition.BEFORE_END);
      this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    }

    #renderFilmSection = () => {
      render(this.#sortComponent, this.#filmSectionComponent, RenderPosition.AFTER_END);
    }

    #renderFilm = (filmContainer, film) => {
      const filmPresenter = new FilmPresenter(filmContainer, this.#handleViewAction, this.#handleModeChange);
      filmPresenter.init(film);
      this.#presenters.push(filmPresenter);
    }

    #renderFilms = (sectionFilms, filmContainer) => {
      sectionFilms.forEach((sectionFilm) => this.#renderFilm(filmContainer, sectionFilm));
    }

    #renderFilmList = () => {
      const films = this.films;
      const filmCount = this.films.length;

      this.#renderFilms(films);

      if (filmCount > FILMS_COUNT_PER_STEP) {
        this.#renderShowMoreButton();
      }
    }

    #renderShowMoreButton = () => {
      render(this.#filmContainer, this.#showMoreButtonComponent, RenderPosition.AFTER_END);
      this.#showMoreButtonComponent.setShowMoreButtonClickHandler(this.#handleShowMoreButtonClick);
    }

    #renderExtraFilms = (extraContainer, extraFilms, extraSection) => {
      if (extraFilms) {
        this.#renderFilms(extraFilms, 0, EXTRA_FILMS_COUNT, extraContainer);
      } else {
        extraSection.remove();
      }
    }

    #renderNoFilm = () => {
      render(this.#filmListContainer, this.#noFilmComponent, RenderPosition.BEFORE_END);
    }

    #renderFilmCollection = () => {
      if (this.films.length) {
        this.#renderFilmSort();
        this.#renderFilmSection();
        this.#renderFilmList();
        this.#renderExtraFilms(this.#topRatedFilmContainer, this.topRatedFilms, this.#topRatedSection);
        this.#renderExtraFilms(this.#mostCommentedFilmContainer, this.mostCommentedFilms, this.#mostCommentedSection);
      } else {
        this.#renderNoFilm();
      }
    }
}
