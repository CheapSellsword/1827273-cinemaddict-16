import { FILMS_COUNT_PER_STEP, EXTRA_FILMS_COUNT, SortType, UpdateType, UserAction, FilterType } from '../consts';
import { render, RenderPosition, remove } from '../utils/render';
import { compareByField } from '../utils/common';
import { filter } from '../utils/filter';
import ShowMoreButtonView from '../view/show-more-button-view';
import FilmSectionView from '../view/film-section-view';
import FilmPresenter from './film-presenter';
import NoFilmView from '../view/no-film-view';
import SortView from '../view/sort-view';

export default class FilmCollectionPresenter {
    #filmListContainer = null;
    #filmsModel = null;
    #filterModel = null;

    #noFilmComponent = null;
    #filmSectionComponent = new FilmSectionView();
    #sortComponent = null;
    #showMoreButtonComponent = null;

    #presenters = [];
    #currentSortType = SortType.DEFAULT;
    #filterType = FilterType.ALL;
    #renderedFilmCount = FILMS_COUNT_PER_STEP;
    #filmContainer = this.#filmSectionComponent.filmContainer;
    #topRatedSection = this.#filmSectionComponent.topRatedSection;
    #mostCommentedSection = this.#filmSectionComponent.mostCommentedSection;
    #topRatedFilmContainer = this.#filmSectionComponent.topRatedFilmContainer;
    #mostCommentedFilmContainer = this.#filmSectionComponent.mostCommentedFilmContainer;
    #body = document.querySelector('body');

    constructor(filmCollectionContainer, filmsModel, filterModel) {
      this.#filmListContainer = filmCollectionContainer;
      this.#filmsModel = filmsModel;
      this.#filterModel = filterModel;

      this.#filmsModel.addObserver(this.#handleModelEvent);
      this.#filterModel.addObserver(this.#handleModelEvent);
    }

    get films() {
      this.#filterType = this.#filterModel.filter;
      const films = this.#filmsModel.films;
      const filteredFilms = filter[this.#filterType](films);

      switch (this.#currentSortType) {
        case SortType.DATE:
          return filteredFilms.sort(compareByField('releaseYear'));
        case SortType.RATING:
          return filteredFilms.sort(compareByField('rating'));
      }
      return filteredFilms;
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
          this.#clearFilmCollection();
          this.#renderFilmCollection();

          break;
        case UpdateType.MAJOR:
          this.#clearFilmCollection();
          this.#renderFilmCollection();

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
      this.#currentSortType = sortType;
      this.#clearFilmCollection();
      this.#renderFilmCollection();
    }

    #clearFilmCollection = ({resetRenderedFilmCount = false, resetSortType = false} = {}) => {

      this.#presenters.forEach((presenter) => presenter.destroy());
      this.#presenters = [];

      remove(this.#sortComponent);
      remove(this.#showMoreButtonComponent);

      if (this.#noFilmComponent) {
        remove(this.#noFilmComponent);
      }

      if (resetRenderedFilmCount) {
        this.#renderedFilmCount = FILMS_COUNT_PER_STEP;
      }

      if (resetSortType) {
        this.#currentSortType = SortType.DEFAULT;
      }
    }

    #renderFilmSort = () => {
      this.#sortComponent = new SortView(this.#currentSortType);
      this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
      render(this.#filmListContainer, this.#sortComponent, RenderPosition.BEFORE_END);
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

    #renderShowMoreButton = () => {
      this.#showMoreButtonComponent = new ShowMoreButtonView();
      this.#showMoreButtonComponent.setShowMoreButtonClickHandler(this.#handleShowMoreButtonClick);
      render(this.#filmContainer, this.#showMoreButtonComponent, RenderPosition.AFTER_END);
    }

    #renderExtraFilms = (extraContainer, extraFilms, extraSection) => {
      if (extraFilms) {
        this.#renderFilms(extraFilms, 0, EXTRA_FILMS_COUNT, extraContainer);
      } else {
        extraSection.remove();
      }
    }

    #renderNoFilm = () => {
      if (this.#filmSectionComponent) {
        remove(this.#filmSectionComponent);
      }
      this.#noFilmComponent = new NoFilmView(this.#filterType);
      render(this.#filmListContainer, this.#noFilmComponent, RenderPosition.BEFORE_END);
    }

    #renderFilmCollection = () => {
      const films = this.films;
      const filmCount = films.length;

      if (filmCount === 0) {
        this.#renderNoFilm();
        return;
      }

      this.#renderFilmSort();
      this.#renderFilmSection();
      this.#renderFilms(films.slice(0, Math.min(filmCount, this.#renderedFilmCount)), this.#filmContainer);
      if (filmCount > this.#renderedFilmCount) {
        this.#renderShowMoreButton();
      }

      this.#renderExtraFilms(this.#topRatedFilmContainer, this.topRatedFilms, this.#topRatedSection);
      this.#renderExtraFilms(this.#mostCommentedFilmContainer, this.mostCommentedFilms, this.#mostCommentedSection);
    }
}
