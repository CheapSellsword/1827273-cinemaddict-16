import { GENERATED_FILMS_COUNT, FILMS_COUNT_PER_STEP } from './consts';
import { RenderPosition, render } from './render';
import { generateFilm } from './mock/film';
import { generateFilter } from './mock/filter';
import FilmCountView from './view/film-count-view';
import FiltersAndStatsBarView from './view/filters-and-stats-bar-view.js';
import SortView from './view/sort-view';
import ProfileRankAndAvatarView from './view/profile-and-rank-avatar-view';
import FilmsSectionView from './view/films-section-view';
import FilmCardView from './view/film-card-view';
import ShowMoreButtonView from './view/show-more-button-view';
import FilmPopupView from './view/film-popup-view';

//Почему функция generateFilm здесь идёт без вызова?
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
  const closePopupButton = filmPopupComponent.element.querySelector('.film-details__close-btn');

  // Как сделать так, чтобы, при открытии попапа, закрывался уже открытый попап? Или это будет в следующих заданиях?
  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      body.classList.remove('hide-overflow');
      body.removeChild(filmPopupComponent.element);
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  const onCloseButtonClick = () => {
    body.classList.remove('hide-overflow');
    body.removeChild(filmPopupComponent.element);
    document.removeEventListener('keydown', onEscKeyDown);
    closePopupButton.removeEventListener('click', onCloseButtonClick);
  };

  filmComponent.element.querySelector('.film-card__link').addEventListener('click', () => {
    body.appendChild(filmPopupComponent.element);
    body.classList.add('hide-overflow');
    document.addEventListener('keydown', onEscKeyDown);
    closePopupButton.addEventListener('click', onCloseButtonClick);
  });
  render(filmListElement, filmComponent.element, RenderPosition.BEFORE_END);
};

render(headerElement, new ProfileRankAndAvatarView().element, RenderPosition.BEFORE_END);

const filtersAndStatsBar =  new FiltersAndStatsBarView(filters);
render(mainElement, filtersAndStatsBar.element, RenderPosition.AFTER_BEGIN);

// Для второй части задания
// if (films.length === 0) {
//   render(filtersAndStatsBar.element, new NoFilmView(filters).element, RenderPosition.AFTER_END);
// } else {}
const filmSort = new SortView();
render(filtersAndStatsBar.element, filmSort.element, RenderPosition.AFTER_END);

render(filmSort.element, new FilmsSectionView().element, RenderPosition.AFTER_END);

const cardContainerElement = mainElement.querySelector('.films-list__container');

for (let i = 0; i < Math.min(films.length, FILMS_COUNT_PER_STEP); i++) {
  renderFilm(cardContainerElement, films[i]);
}

if (films.length > FILMS_COUNT_PER_STEP) {
  let renderedFilmCardsCount = FILMS_COUNT_PER_STEP;

  const showMoreButtonComponent = new ShowMoreButtonView();

  render(cardContainerElement, showMoreButtonComponent.element, RenderPosition.AFTER_END);

  // Почему, если '.films-list__show-more' искать селектором не в 'mainElement', а в 'showMoreButtonComponent.element', то консоль выдает
  // Uncaught TypeError: Cannot read properties of null (reading 'addEventListener')
  //   at main.js:84
  //   at bundle.js:5605
  //   at bundle.js:5607

  const showMoreButton = mainElement.querySelector('.films-list__show-more');
  //const showMoreButton = showMoreButtonComponent.element.querySelector('.films-list__show-more');

  showMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();
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


render(footerStatsElement, new FilmCountView(films).element, RenderPosition.BEFORE_END);
