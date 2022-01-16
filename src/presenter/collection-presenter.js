import { FILMS_COUNT_PER_STEP, EXTRA_FILMS_COUNT, SortType } from '../consts';
import { createTopRatedFilmList, createMostCommentedFilmList } from '../mock/extra-films';
import { render, RenderPosition, remove } from '../utils/render';
import { updateItem, compareByField } from '../utils/common';
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
    #topRatedFilms = [];
    #collectionFilms = [];
    #mostCommentedFilms = [];
    #sourcedCollectionFilms = [];
    #currentSortType = SortType.DEFAULT;
    #renderedFilmsCount = FILMS_COUNT_PER_STEP;
    #filmContainer = this.#filmSectionComponent.filmContainer;
    #topRatedSection = this.#filmSectionComponent.topRatedSection;
    #mostCommentedSection = this.#filmSectionComponent.mostCommentedSection;
    #topRatedFilmContainer = this.#filmSectionComponent.topRatedFilmContainer;
    #mostCommentedFilmContainer = this.#filmSectionComponent.mostCommentedFilmContainer;
    #body = document.querySelector('body');

    constructor(filmCollectionContainer, filmsModel) {
      this.#filmListContainer = filmCollectionContainer;
      this.#filmsModel = filmsModel;
    }

    get films() {
      return this.#filmsModel.films;
    }

    get topRatedFilms() {
      return this.#filmsModel.topRatedFilms;
    }

    get mostCommentedFilms() {
      return this.#filmsModel.mostCommentedFilms;
    }

    init = (collectionFilms) => {
      this.#collectionFilms = [...collectionFilms];
      this.#topRatedFilms = [...createTopRatedFilmList(this.#collectionFilms)];
      this.#mostCommentedFilms = [...createMostCommentedFilmList(this.#collectionFilms)];
      this.#sourcedCollectionFilms = [...collectionFilms];
      this.#renderFilmCollection();
    }

    #handleFilmChange = (updatedFilm) => {
      this.#collectionFilms = updateItem(this.#collectionFilms, updatedFilm);
      this.#sourcedCollectionFilms = updateItem(this.#sourcedCollectionFilms, updatedFilm);
      this.#presenters.forEach((presenter) => {
        if (presenter.id === updatedFilm.id) {
          presenter.init(updatedFilm);
        }
      });
    }

    #handleShowMoreButtonClick = () => {
      this.#renderFilms(this.#collectionFilms, this.#renderedFilmsCount, this.#renderedFilmsCount + FILMS_COUNT_PER_STEP, this.#filmContainer);
      this.#renderedFilmsCount += FILMS_COUNT_PER_STEP;
      if (this.#renderedFilmsCount >= this.#collectionFilms.length) {
        remove(this.#showMoreButtonComponent);
      }
    }

    #handleModeChange = () => {
      this.#presenters.forEach((presenter) => presenter.closePopup());
    }

      #sortFilms = (sortType) => {
        switch (sortType) {
          case SortType.DATE:
            this.#collectionFilms.sort(compareByField('releaseYear'));
            break;
          case SortType.RATING:
            this.#collectionFilms.sort(compareByField('rating'));
            break;
          default:
            this.#collectionFilms = [...this.#sourcedCollectionFilms];
        }
        this.#currentSortType = sortType;
      }

    #handleSortTypeChange = (sortType) => {
      if (this.#currentSortType === sortType) {
        return;
      }
      this.#body.classList.remove('hide-overflow');
      this.#sortFilms(sortType);
      this.#clearFilmSection();
      this.#renderFilmSort();
      this.#renderFilmSection();
      this.#renderFilmList();
      this.#renderExtraFilms(this.#topRatedFilmContainer, this.#topRatedFilms, this.#topRatedSection);
      this.#renderExtraFilms(this.#mostCommentedFilmContainer, this.#mostCommentedFilms, this.#mostCommentedSection);
    }

    #clearFilmSection = () => {
      remove(this.#sortComponent);
      this.#presenters.forEach((presenter) => presenter.destroy());
      this.#presenters = [];
      this.#renderedFilmsCount = FILMS_COUNT_PER_STEP;
      remove(this.#showMoreButtonComponent);
    }

    #clearFilmCollection = () => {
      remove(this.#sortComponent);
      remove(this.#filmSectionComponent);
      remove(this.#showMoreButtonComponent);
      this.#renderedFilmsCount = 0;
    }

    #renderFilmSort = () => {
      render(this.#filmListContainer, this.#sortComponent, RenderPosition.BEFORE_END);
      this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    }

    #renderFilmSection = () => {
      render(this.#sortComponent, this.#filmSectionComponent, RenderPosition.AFTER_END);
    }

    #renderFilm = (filmContainer, film) => {
      const filmPresenter = new FilmPresenter(filmContainer, this.#handleFilmChange, this.#handleModeChange);
      filmPresenter.init(film);
      this.#presenters.push(filmPresenter);
    }

    #renderFilms = (sectionFilms, from, to, filmContainer) => {
      sectionFilms
        .slice(from, to)
        .forEach((sectionFilm) => this.#renderFilm(filmContainer, sectionFilm));
    }

    #renderFilmList = () => {
      this.#renderFilms(this.#collectionFilms, 0, Math.min(this.#collectionFilms.length, FILMS_COUNT_PER_STEP), this.#filmContainer);
      if (this.#collectionFilms.length > FILMS_COUNT_PER_STEP) {
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
      if (this.#collectionFilms.length) {
        this.#renderFilmSort();
        this.#renderFilmSection();
        this.#renderFilmList();
        this.#renderExtraFilms(this.#topRatedFilmContainer, this.#topRatedFilms, this.#topRatedSection);
        this.#renderExtraFilms(this.#mostCommentedFilmContainer, this.#mostCommentedFilms, this.#mostCommentedSection);
      } else {
        this.#renderNoFilm();
      }
    }
}
