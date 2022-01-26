import { GENERATED_FILMS_COUNT } from './consts';
import { RenderPosition, render } from './utils/render';
import { generateFilm } from './mock/film';
import FilmCountView from './view/film-count-view';
import ProfileRankAndAvatarView from './view/profile-and-rank-avatar-view';
import FilmCollectionPresenter from './presenter/film-collection-presenter';
import FilmsModel from './model/films-model';
import FilterModel from './model/filter-model';
import FilterPresenter from './presenter/filter-presenter';
import CommentsModel from './model/comments-model';


const films = Array.from({length: GENERATED_FILMS_COUNT}, generateFilm);

const commentsModel = new CommentsModel();
const filmsModel = new FilmsModel(commentsModel);
filmsModel.films = films;

const filterModel = new FilterModel();

const headerElement = document.querySelector('.header');
export const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');
const footerStatsElement = footerElement.querySelector('.footer__statistics');

const filmCollectionPresenter = new FilmCollectionPresenter(mainElement, filmsModel, filterModel, commentsModel);

const filterPresenter = new FilterPresenter(mainElement, filterModel, filmsModel);

filterPresenter.init();

render(headerElement, new ProfileRankAndAvatarView(films), RenderPosition.BEFORE_END);

filmCollectionPresenter.init();

render(footerStatsElement, new FilmCountView(films), RenderPosition.BEFORE_END);

