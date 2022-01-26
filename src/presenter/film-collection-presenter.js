import { FILMS_COUNT_PER_STEP, SortType, UpdateType, UserAction, FilterType, Mode } from '../consts';
import { render, RenderPosition, remove } from '../utils/render';
import { compareByField } from '../utils/common';
import { filter } from '../utils/filter';
import { State } from '../consts';
import ShowMoreButtonView from '../view/show-more-button-view';
import FilmSectionView from '../view/film-section-view';
import LoadingView from '../view/loading-view';
import NoFilmView from '../view/no-film-view';
import FilmPresenter from './film-presenter';
import SortView from '../view/sort-view';

export default class FilmCollectionPresenter {
    #mostCommentedFilmContainer = null;
    #showMoreButtonComponent = null;
    #topRatedFilmContainer = null;
    #filmSectionComponent = null;
    #mostCommentedSection = null;
    #popupScrollPosition = null;
    #filmListContainer = null;
    #filmSortComponent = null;
    #noFilmComponent = null;
    #topRatedSection = null;
    #filmContainer = null;
    #commentsModel = null;
    #filterModel = null;
    #filmsModel = null;

    #loadingComponent = new LoadingView();

    #presenters = [];
    #isLoading = true;
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
      remove(this.#loadingComponent);
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

    #handleViewAction = async (actionType, updateType, mode, update, film) => {
      switch (actionType) {
        case UserAction.UPDATE_FILM:
          this.#presenters.find((presenter) => presenter.id === update.id).setViewState(State.SAVING);
          try {
            await this.#filmsModel.updateFilm(updateType, mode, update);
          } catch (err) {
            this.#presenters.find((presenter) => presenter.id === update.id).setViewState(State.ABORTING);
          }
          break;
        case UserAction.ADD_COMMENT:
          this.#presenters.find((presenter) => presenter.id === film.id).setViewState(State.SAVING);
          try {
            await this.#commentsModel.addComment(updateType, mode, update);
          } catch (err) {
            this.#presenters.find((presenter) => presenter.id === film.id).setViewState(State.ABORTING);
          }
          break;
        case UserAction.DELETE_COMMENT:
          this.#presenters.find((presenter) => presenter.id === film.id).setViewState(State.DELETING);
          try {
            await this.#commentsModel.deleteComment(updateType, mode, update, film);
          } catch {
            this.#presenters.find((presenter) => presenter.id === film.id).setViewState(State.ABORTING);
          }
          break;
      }
    }

    #handleModelEvent = (updateType, mode, update) => {
      switch (updateType) {
        case UpdateType.MINOR:
          if (mode === Mode.POPUP) {
            const prevPopupPresenter = this.#presenters.find((presenter) => presenter.id === update.id);
            this.#popupScrollPosition = prevPopupPresenter.popupScrollPosition;
            prevPopupPresenter.removeDocumentEventListeners();
          }
          this.#clearFilmCollection();
          this.#renderFilmCollection();
          if (mode === Mode.POPUP) {
            const newPopupPresenter = this.#presenters.find((presenter) => presenter.id === update.id);
            newPopupPresenter.openPopup(this.#popupScrollPosition);
          }
          break;
        case UpdateType.MAJOR:
          this.#clearFilmCollection({resetRenderedFilmCount: true, resetSortType: true});
          this.#renderFilmCollection();
          break;
        case UpdateType.INIT:
          this.#isLoading = false;
          remove(this.#loadingComponent);
          this.#renderFilmCollection();
          break;
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

    #renderLoading = () => {
      render(this.#filmListContainer, this.#loadingComponent, RenderPosition.BEFORE_END);
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

      if (this.#isLoading) {
        this.#renderLoading();
        return;
      }

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
