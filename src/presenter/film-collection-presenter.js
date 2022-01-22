import { FILMS_COUNT_PER_STEP, SortType, UpdateType, UserAction, FilterType } from '../consts';
import { render, RenderPosition, remove } from '../utils/render';
import { compareByField } from '../utils/common';
import { filter } from '../utils/filter';
import ShowMoreButtonView from '../view/show-more-button-view';
import FilmSectionView from '../view/film-section-view';
import FilmPresenter from './film-presenter';
import NoFilmView from '../view/no-film-view';
import SortView from '../view/sort-view';
import StatsView from '../view/stats-view';

export default class FilmCollectionPresenter {
    #mostCommentedFilmContainer = null;
    #showMoreButtonComponent = null;
    #topRatedFilmContainer = null;
    #filmSectionComponent = null;
    #mostCommentedSection = null;
    #filmListContainer = null;
    #filmSortComponent = null;
    #noFilmComponent = null;
    #topRatedSection = null;
    #statsComponent = null;
    #commentsModel = null;
    #filmContainer = null;
    #filterModel = null;
    #filmsModel = null;

    #presenters = [];
    #filterType = FilterType.ALL;
    #currentSortType = SortType.DEFAULT;
    #renderedFilmCount = FILMS_COUNT_PER_STEP;

    constructor(filmCollectionContainer, filmsModel, filterModel, commentsModel) {
      this.#filmListContainer = filmCollectionContainer;
      this.#filmsModel = filmsModel;
      this.#filterModel = filterModel;
      this.#commentsModel = commentsModel;

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

    #clearFilmCollection = ({resetRenderedFilmCount = false, resetSortType = false} = {}) => {

      this.#presenters.forEach((presenter) => presenter.destroy());
      this.#presenters = [];

      remove(this.#filmSortComponent);
      remove(this.#showMoreButtonComponent);
      remove(this.#filmSectionComponent);

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

    #clearStats = () => {
      remove(this.#statsComponent);
    }

    #handleViewAction = (actionType, updateType, update, film) => {
      switch (actionType) {
        case UserAction.UPDATE_FILM:
          this.#filmsModel.updateFilm(updateType, update);
          break;
        case UserAction.ADD_COMMENT:
          this.#commentsModel.addComment(updateType, update, film);
          break;
        case UserAction.DELETE_COMMENT:
          this.#commentsModel.deleteComment(updateType, update, film);
          break;
      }
    }

    #handleModelEvent = (updateType) => {
      switch (updateType) {
        case UpdateType.MINOR:
          if (this.#statsComponent) {
            this.#clearStats();
          }
          this.#clearFilmCollection();
          this.#renderFilmCollection();
          break;
        case UpdateType.MAJOR:
          if (this.#statsComponent) {
            this.#clearStats();
          }
          this.#clearFilmCollection({resetRenderedFilmCount: true, resetSortType: true});
          this.#renderFilmCollection();
          break;
        case UpdateType.STATS:
          if (this.#statsComponent) {
            return;
          }
          this.#renderStats();
          this.#clearFilmCollection();
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

    #renderNoFilm = () => {
      if (this.#filmSectionComponent) {
        remove(this.#filmSectionComponent);
      }
      this.#noFilmComponent = new NoFilmView(this.#filterType);
      render(this.#filmListContainer, this.#noFilmComponent, RenderPosition.BEFORE_END);
    }

    #renderFilmSort = () => {
      this.#filmSortComponent = new SortView(this.#currentSortType);
      this.#filmSortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
      render(this.#filmListContainer, this.#filmSortComponent, RenderPosition.BEFORE_END);
    }

    #renderStats = () => {
      this.#statsComponent = new StatsView();
      render(this.#filmSortComponent, this.#statsComponent, RenderPosition.BEFORE_BEGIN);
    }

    #renderFilmSection = () => {
      this.#filmSectionComponent = new FilmSectionView();
      this.#filmContainer = this.#filmSectionComponent.filmContainer;
      this.#topRatedSection = this.#filmSectionComponent.topRatedSection;
      this.#topRatedFilmContainer = this.#filmSectionComponent.topRatedFilmContainer;
      this.#mostCommentedSection = this.#filmSectionComponent.mostCommentedSection;
      this.#mostCommentedFilmContainer = this.#filmSectionComponent.mostCommentedFilmContainer;

      render(this.#filmSortComponent, this.#filmSectionComponent, RenderPosition.AFTER_END);
    }

    #renderFilm = (filmContainer, film) => {
      const filmPresenter = new FilmPresenter(filmContainer, this.#handleViewAction, this.#handleModeChange, this.#commentsModel);
      filmPresenter.init(film);
      this.#presenters.push(filmPresenter);
    }

    #renderFilms = (sectionFilms, filmContainer) => {
      sectionFilms
        .forEach((sectionFilm) => this.#renderFilm(filmContainer, sectionFilm));
    }

    #renderShowMoreButton = () => {
      this.#showMoreButtonComponent = new ShowMoreButtonView();
      this.#showMoreButtonComponent.setShowMoreButtonClickHandler(this.#handleShowMoreButtonClick);
      render(this.#filmContainer, this.#showMoreButtonComponent, RenderPosition.AFTER_END);
    }

    #renderExtraFilms = (extraContainer, extraFilms, extraSection) => {
      if (extraFilms) {
        this.#renderFilms(extraFilms, extraContainer);
      } else {
        extraSection.remove();
      }
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
