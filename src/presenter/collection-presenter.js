import { FILMS_COUNT_PER_STEP, EXTRA_FILMS_COUNT/*, SortTypes */} from '../consts';
import { render, RenderPosition, remove, appendChild, replace } from '../utils/render';
import { createTopRatedFilmList, createMostCommentedFilmList } from '../mock/extra-films';
import SortView from '../view/sort-view';
import FilmSectionView from '../view/film-section-view';
import ShowMoreButtonView from '../view/show-more-button-view';
import NoFilmView from '../view/no-film-view';
import FilmCardView from '../view/film-card-view';
import FilmPopupView from '../view/film-popup-view';
import { updateItem } from '../utils/common';
//import { sortByDate, sortByRating, compareByField } from '../utils/film-sort';

export default class CollectionPresenter {
  #collectionContainer = null;
  #popupComponent = null;

  #sortComponent = new SortView();
  #filmSectionComponent = new FilmSectionView();
  #showMoreButtonComponent = new ShowMoreButtonView();
  #noFilmComponent = new NoFilmView();

  #collectionFilms = [];
  #topRatedFilms = [];
  #mostCommentedFilms = [];
  //#currentSortType = SortTypes.DEFAULT;
  //#sourcedCollectionFilms = [];

  #body = document.querySelector('body');
  #renderedFilmCardsCount = FILMS_COUNT_PER_STEP;
  #filmContainer = this.#filmSectionComponent.filmContainer;
  #topRatedSection = this.#filmSectionComponent.topRatedSection;
  #topRatedFilmContainer = this.#filmSectionComponent.topRatedFilmContainer;
  #mostCommentedSection = this.#filmSectionComponent.mostCommentedSection;
  #mostCommentedFilmContainer = this.#filmSectionComponent.mostCommentedFilmContainer;

  constructor(collectionContainer) {
    this.#collectionContainer = collectionContainer;
  }

  init = (collectionFilms) => {
    this.#collectionFilms = [...collectionFilms];
    //this.#sourcedCollectionFilms = [...collectionFilms];
    this.#topRatedFilms = [...createTopRatedFilmList(this.#collectionFilms)];
    this.#mostCommentedFilms = [...createMostCommentedFilmList(this.#collectionFilms)];
    this.#renderCollection(/*this.#collectionFilms*/);
  }

  // #handleFilmChange = (updatedFilm) => {
  //   this.#collectionFilms = updateItem(this.#collectionFilms, updatedFilm);
  //   //this.#sourcedCollectionFilms = updateItem(this.#sourcedCollectionFilms, updatedFilm);
  //   this.#filmPresenter.get(updatedFilm.id).init(updatedFilm);
  // }

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

  // #sortFilms = (sortType) => {
  //   switch (sortType) {
  //     case SortTypes.DATE:
  //       this.#collectionFilms.sort(compareByField('releaseYear'));
  //       break;
  //     case SortTypes.RATING:
  //       this.#collectionFilms.sort(compareByField('rating'));
  //       break;
  //     default:
  //       this.#collectionFilms = [...this.#sourcedCollectionFilms];
  //   }

  //   this.#currentSortType = sortType;
  // }

  // #handleSortTypeChange = (sortType) => {
  //   if (this.#currentSortType === sortType) {
  //     return;
  //   }

  //   this.#sortFilms(sortType);
  //   this.#clearFilmSection();
  //   this.#renderFilmSection();
  // }

  #renderSort = () => {
    render(this.#collectionContainer, this.#sortComponent, RenderPosition.BEFORE_END);
  // this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
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

  #renderExtraFilms = (extraContainer, extraFilms, extraSection) => {
    if (extraFilms) {
      this.#renderFilms(extraFilms, 0, EXTRA_FILMS_COUNT, extraContainer);
      // extraFilms.forEach((film) => this.#renderFilm(extraContainer, film));
    } else {
      extraSection.remove();
    }
  }

  #renderNoFilm = () => {
    render(this.#collectionContainer, this.#noFilmComponent);
  }

  // #clearFilmSection = () => {
  //   this.#filmPresenter.forEach((presenter) => presenter.destroy());
  //   this.#filmPresenter.clear();
  //   this.#renderedFilmCardsCount = FILMS_COUNT_PER_STEP;
  //   remove(this.#showMoreButtonComponent);
  // }

  // #clearFilmCollection = () => {
  //   remove(this.#sortComponent);
  //   remove(this.#filmSectionComponent);
  //   remove(this.#showMoreButtonComponent);
  //   this.#renderedFilmCardsCount = 0;
  // }

  // #handleModeChange = () => {
  //   this.#filmPresenter.forEach((presenter) => presenter.closePopup());
  // }

  #renderCollection = () => {
    if (this.#collectionFilms.length) {
      this.#renderSort();
      this.#renderFilmSection();
      this.#renderFilmList();
      this.#renderExtraFilms(this.#topRatedFilmContainer, this.#topRatedFilms, this.#topRatedSection);
      this.#renderExtraFilms(this.#mostCommentedFilmContainer, this.#mostCommentedFilms, this.#mostCommentedSection);
    } else {
      this.#renderNoFilm();
    }
  }
}
