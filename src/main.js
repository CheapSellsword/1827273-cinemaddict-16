import { RenderPosition, renderTemplate } from './render';

import { createSortAndStatsBar } from './view/sort-stats-view';
import { createFilmsSection } from './view/films-section-view';
import { createFilmCard } from './view/film-card-view';
import { createProfileRankAndAvatar } from './view/profile-rank-avatar-view';
import { createShowMoreButton } from './view/show-more-button-view';
import { createFilmPopup } from './view/film-popup.view';
import { createFilmCount } from './view/film-count-view';

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');
const footerStatsElement = footerElement.querySelector('.footer__statistics');

renderTemplate(headerElement, createProfileRankAndAvatar(), RenderPosition.BEFOREEND);
renderTemplate(mainElement, createSortAndStatsBar(), RenderPosition.AFTERBEGIN);
renderTemplate(mainElement, createFilmsSection(), RenderPosition.BEFOREEND);

const cardContainerElement = mainElement.querySelector('.films-list__container');

for (let i = 0; i < 5; i++) {
  renderTemplate(cardContainerElement, createFilmCard(), RenderPosition.AFTERBEGIN);
}

renderTemplate(cardContainerElement, createShowMoreButton(), RenderPosition.AFTEREND);
renderTemplate(footerStatsElement, createFilmCount(), RenderPosition.AFTERBEGIN);

// Мешающий попап!
renderTemplate(footerElement, createFilmPopup(), RenderPosition.AFTEREND);
