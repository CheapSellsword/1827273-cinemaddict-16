import { GENERATED_FILMS_COUNT, FILMS_COUNT_PER_STEP } from './consts';
import { RenderPosition, render } from './render';
import { generateFilm } from './mock/film';
import { generateFilter } from './mock/filter';
import FilmCountView from './view/film-count-view';
import FiltersAndStatsBarView from './view/filter-stats-view';
import FilmSortView from './view/sort-view';
import ProfileRankAndAvatarView from './view/profile-rank-avatar-view';
import FilmsSectionView from './view/films-section-view';
import FilmCardView from './view/film-card-view';
import ShowMoreButtonView from './view/show-more-button-view';
import FilmPopupView from './view/film-popup-view';

const films = Array.from({length: GENERATED_FILMS_COUNT}, generateFilm);
const filters = generateFilter(films);

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');
const footerStatsElement = footerElement.querySelector('.footer__statistics');

const renderFilm = (filmListElement, film) => {
  const filmComponent = new FilmCardView(film);
  const filmPopupComponent = new FilmPopupView(film);

  filmComponent.element.querySelector('.film-card__link').addEventListener('click', () => {

  });

  filmPopupComponent.element.querySelector('.film-details__close-btn').addEventListener('click', () => {

  });

  render(filmListElement, filmComponent.element, RenderPosition.BEFORE_END);
};

render(headerElement, new ProfileRankAndAvatarView().element, RenderPosition.BEFORE_END);

const filtersAndStatsBar =  new FiltersAndStatsBarView(filters);
render(mainElement, filtersAndStatsBar.element, RenderPosition.AFTER_BEGIN);

const filmSort = new FilmSortView();
render(filtersAndStatsBar.element, filmSort.element, RenderPosition.AFTER_END);

render(filmSort.element, new FilmsSectionView().element, RenderPosition.AFTER_END);

const cardContainerElement = mainElement.querySelector('.films-list__container');

for (let i = 0; i < Math.min(films.length, FILMS_COUNT_PER_STEP); i++) {
  renderFilm(cardContainerElement, films[i]);
}

if (films.length > FILMS_COUNT_PER_STEP) {
  let renderedFilmCardsCount = FILMS_COUNT_PER_STEP;

  render(cardContainerElement, new ShowMoreButtonView().element, RenderPosition.AFTER_END);

  const showMoreButton = document.querySelector('.films-list__show-more');

  showMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    films
      .slice(renderedFilmCardsCount, renderedFilmCardsCount + FILMS_COUNT_PER_STEP)
      .forEach((film) => renderFilm(cardContainerElement, film));

    renderedFilmCardsCount += FILMS_COUNT_PER_STEP;

    if (renderedFilmCardsCount >= films.length) {
      showMoreButton.remove();
    }
  });
}

render(footerStatsElement, new FilmCountView(films).element, RenderPosition.BEFORE_END);

render(footerElement, new FilmPopupView(films[0]).element, RenderPosition.AFTER_END);
