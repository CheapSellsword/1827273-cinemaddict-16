import { GENERATED_FILMS_COUNT, FILMS_COUNT_PER_STEP } from './consts';
import { RenderPosition, render, remove, appendChild } from './utils/render';
import { createTopRatedFilmList, createMostCommentedFilmList } from './mock/extra-films';
import { generateFilm } from './mock/film';
import { generateFilter } from './mock/filter';
import FilmCountView from './view/film-count-view';
import FiltersAndStatsView from './view/filters-and-stats-view.js';
import SortView from './view/sort-view';
import ProfileRankAndAvatarView from './view/profile-and-rank-avatar-view';
import FilmSectionView from './view/film-section-view';
import FilmCardView from './view/film-card-view';
import ShowMoreButtonView from './view/show-more-button-view';
import FilmPopupView from './view/film-popup-view';
import NoFilmView from './view/no-film-view';
import CollectionPresenter from './presenter/collection-presenter';


const films = Array.from({length: GENERATED_FILMS_COUNT}, generateFilm);
const filters = generateFilter(films);

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');
const footerStatsElement = footerElement.querySelector('.footer__statistics');

render(headerElement, new ProfileRankAndAvatarView(filters), RenderPosition.BEFORE_END);
const filtersAndStatsComponent =  new FiltersAndStatsView(filters);
render(mainElement, filtersAndStatsComponent, RenderPosition.AFTER_BEGIN);

const collectionPresenter = new CollectionPresenter(mainElement);
collectionPresenter.init(films);

render(footerStatsElement, new FilmCountView(films), RenderPosition.BEFORE_END);
