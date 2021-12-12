import { GENERATED_FILMS_COUNT, FILMS_COUNT_PER_STEP } from './consts';
import { RenderPosition, render, remove, appendChild } from './utils/render';
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

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');
const footerStatsElement = footerElement.querySelector('.footer__statistics');

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
    filmPopupComponent.element.removeEventListener('click', closePopupClickHandler);
  };

  filmComponent.setCardClickHandler(() => {
    appendChild(body, filmPopupComponent);
    body.classList.add('hide-overflow');
    document.addEventListener('keydown', escKeyDownHandler);
    filmPopupComponent.setClosePopupClickHandler(closePopupClickHandler);
  });

  render(filmListElement, filmComponent, RenderPosition.BEFORE_END);
};

render(headerElement, new ProfileRankAndAvatarView(), RenderPosition.BEFORE_END);

const filtersAndStats =  new FiltersAndStatsView(filters);
render(mainElement, filtersAndStats, RenderPosition.AFTER_BEGIN);

if (films.length === 0) {
  render(filtersAndStats.element, new NoFilmView(), RenderPosition.AFTER_END);
} else {
  const filmSort = new SortView();
  render(filtersAndStats.element, filmSort, RenderPosition.AFTER_END);

  render(filmSort.element, new FilmsSectionView(), RenderPosition.AFTER_END);

  const cardContainerElement = mainElement.querySelector('.films-list__container');

  for (let i = 0; i < Math.min(films.length, FILMS_COUNT_PER_STEP); i++) {
    renderFilm(cardContainerElement, films[i]);
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
        showMoreButtonComponent.element.remove();
        showMoreButtonComponent.removeElement();
      }
    });
  }
}

render(footerStatsElement, new FilmCountView(films), RenderPosition.BEFORE_END);
