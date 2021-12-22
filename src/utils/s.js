import { GENERATED_FILMS_COUNT, FILMS_COUNT_PER_STEP } from './consts';
import { RenderPosition, render, remove, appendChild } from './utils/render';
import { createTopRatedFilmList, createMostCommentedFilmList } from './mock/extra-films';
import { generateFilm } from './mock/film';
import { generateFilter } from './mock/filter';
import FilmCountView from './view/film-count-view';
import FiltersAndStatsView from './view/filters-and-stats-view.js';
import SortView from './view/sort-view';
import ProfileRankAndAvatarView from './view/profile-and-rank-avatar-view';
import FilmsSectionView from './view/films-section-view';
import FilmCardView from './view/film-card-view';
import ShowMoreButtonView from './view/show-more-button-view';
import FilmPopupView from './view/film-popup-view';
import NoFilmView from './view/no-film-view';

const films = Array.from({length: GENERATED_FILMS_COUNT}, generateFilm);
const filters = generateFilter(films);

// const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
// const footerElement = document.querySelector('.footer');
// const footerStatsElement = footerElement.querySelector('.footer__statistics');

const renderFilm = (filmListElement, film) => {
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

  render(filmListElement, filmComponent, RenderPosition.BEFORE_END);
};

//render(headerElement, new ProfileRankAndAvatarView(films), RenderPosition.BEFORE_END);

const filtersAndStatsComponent =  new FiltersAndStatsView(filters);
render(mainElement, filtersAndStatsComponent, RenderPosition.AFTER_BEGIN);

if (films.length === 0) {
  render(filtersAndStatsComponent, new NoFilmView(), RenderPosition.AFTER_END);
} else {
  const filmSortComponent = new SortView();
  render(filtersAndStatsComponent, filmSortComponent, RenderPosition.AFTER_END);

  const filmsSectionComponent = new FilmsSectionView();
  render(filmSortComponent, filmsSectionComponent, RenderPosition.AFTER_END);

  const cardContainerElement = mainElement.querySelector('.films-list__container');

  for (let i = 0; i < Math.min(films.length, FILMS_COUNT_PER_STEP); i++) {
    renderFilm(cardContainerElement, films[i]);
  }

  const topRatedSection = filmsSectionComponent.element.querySelector('.films-list--extra');
  const topRatedFilmContainer = topRatedSection.querySelector('.films-list__container');

  if (createTopRatedFilmList(films) === null) {
    topRatedSection.remove();
  } else {
    createTopRatedFilmList(films).forEach((film) => renderFilm(topRatedFilmContainer, film));
  }

  const mostCommentedSection = filmsSectionComponent.element.querySelector('.films-list--extra:last-child');
  const mostCommentedFilmContainer = mostCommentedSection.querySelector('.films-list__container');

  if (createMostCommentedFilmList(films) === null) {
    mostCommentedSection.remove();
  } else {
    createMostCommentedFilmList(films).forEach((film) => renderFilm(mostCommentedFilmContainer, film));
  }

  if (films.length > FILMS_COUNT_PER_STEP) {
    let renderedFilmCardsCount = FILMS_COUNT_PER_STEP;

    const showMoreButtonComponent = new ShowMoreButtonView();

    render(cardContainerElement, showMoreButtonComponent, RenderPosition.AFTER_END);

    showMoreButtonComponent.setShowMoreButtonClickHandler(() => {
      films
        .slice(renderedFilmCardsCount, renderedFilmCardsCount + FILMS_COUNT_PER_STEP)
        .forEach((film) => renderFilm(cardContainerElement, film));

      renderedFilmCardsCount += FILMS_COUNT_PER_STEP;

      if (renderedFilmCardsCount >= films.length) {
        remove(showMoreButtonComponent);
      }
    });
  }
}

//render(footerStatsElement, new FilmCountView(films), RenderPosition.BEFORE_END);
