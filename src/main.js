import { GENERATED_FILMS_COUNT } from './consts';
import { RenderPosition, render } from './utils/render';
import { generateFilm } from './mock/film';
import { generateFilter } from './mock/filter';
import FilmCountView from './view/film-count-view';
import FiltersAndStatsView from './view/filters-and-stats-view.js';
import ProfileRankAndAvatarView from './view/profile-and-rank-avatar-view';
import CollectionPresenter from './presenter/collection-presenter';
import FilmsModel from './model/films-model';

const films = Array.from({length: GENERATED_FILMS_COUNT}, generateFilm);
const filters = generateFilter(films);

const filmsModel = new FilmsModel();
filmsModel.films = films;

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');
const footerStatsElement = footerElement.querySelector('.footer__statistics');

const collectionPresenter = new CollectionPresenter(mainElement, filmsModel);

render(headerElement, new ProfileRankAndAvatarView(filters), RenderPosition.BEFORE_END);
const filtersAndStatsComponent =  new FiltersAndStatsView(filters);
render(mainElement, filtersAndStatsComponent, RenderPosition.AFTER_BEGIN);

collectionPresenter.init(films);

render(footerStatsElement, new FilmCountView(films), RenderPosition.BEFORE_END);
