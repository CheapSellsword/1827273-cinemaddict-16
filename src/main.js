import * as consts from './consts';
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

renderTemplate(headerElement, createProfileRankAndAvatar(), RenderPosition.BEFORE_END);
renderTemplate(mainElement, createSortAndStatsBar(), RenderPosition.AFTER_BEGIN);
renderTemplate(mainElement, createFilmsSection(), RenderPosition.BEFORE_END);

// closest?
const cardContainerElement = mainElement.querySelector('.films-list__container');

for (let i = 0; i < consts.CARDS_REQUIRED; i++) {
  renderTemplate(cardContainerElement, createFilmCard(), RenderPosition.AFTER_BEGIN);
}

renderTemplate(cardContainerElement, createShowMoreButton(), RenderPosition.AFTER_END);
renderTemplate(footerStatsElement, createFilmCount(), RenderPosition.AFTER_BEGIN);

// Мешающий попап!
renderTemplate(footerElement, createFilmPopup(), RenderPosition.AFTER_END);
