import { GENERATED_FILMS_COUNT, FILMS_COUNT_PER_STEP } from './consts';
import { RenderPosition, renderTemplate } from './render';
import { createSortAndStatsBar } from './view/sort-stats-view';
import { createFilmsSection } from './view/films-section-view';
import { createFilmCard } from './view/film-card-view';
import { createProfileRankAndAvatar } from './view/profile-rank-avatar-view';
import { createShowMoreButton } from './view/show-more-button-view';
import { createFilmPopup } from './view/film-popup.view';
import { createFilmCount } from './view/film-count-view';
import { createComments } from './view/comments-view';
import { generateFilm } from './mock/film';
import { generateFilter } from './mock/filter';

const films = Array.from({length: GENERATED_FILMS_COUNT}, generateFilm);
const filters = generateFilter(films);

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');
const footerStatsElement = footerElement.querySelector('.footer__statistics');

renderTemplate(headerElement, createProfileRankAndAvatar(), RenderPosition.BEFORE_END);
renderTemplate(mainElement, createSortAndStatsBar(filters));
renderTemplate(mainElement, createFilmsSection(), RenderPosition.BEFORE_END);

const cardContainerElement = mainElement.querySelector('.films-list__container');

for (let i = 0; i < Math.min(films.length, FILMS_COUNT_PER_STEP); i++) {
  renderTemplate(cardContainerElement, createFilmCard(films[i]), RenderPosition.BEFORE_END);
}

if (films.length > FILMS_COUNT_PER_STEP) {
  let renderedFilmCardsCount = FILMS_COUNT_PER_STEP;

  renderTemplate(cardContainerElement, createShowMoreButton(), RenderPosition.AFTER_END);

  const showMoreButton = document.querySelector('.films-list__show-more');

  showMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    films
      .slice(renderedFilmCardsCount, renderedFilmCardsCount + FILMS_COUNT_PER_STEP)
      .forEach((film) => renderTemplate(cardContainerElement, createFilmCard(film), RenderPosition.BEFORE_END));

    renderedFilmCardsCount += FILMS_COUNT_PER_STEP;

    if (renderedFilmCardsCount >= films.length) {
      showMoreButton.remove();
    }
  });
}

renderTemplate(footerStatsElement, createFilmCount());
renderTemplate(footerElement, createFilmPopup(films[0]), RenderPosition.AFTER_END);

const commentsList = document.querySelector('.film-details__comments-list');
renderTemplate (commentsList, createComments(films[0]), RenderPosition.BEFORE_END);
