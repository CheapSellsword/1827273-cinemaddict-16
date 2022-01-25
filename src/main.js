import { GENERATED_FILMS_COUNT, AUTHORIZATION, END_POINT } from './consts';
import { RenderPosition, render } from './utils/render';
import { generateFilm } from './mock/film';
import FilmCountView from './view/film-count-view';
import ProfileRankAndAvatarView from './view/profile-and-rank-avatar-view';
import FilmCollectionPresenter from './presenter/film-collection-presenter';
import FilmsModel from './model/films-model';
import FilterModel from './model/filter-model';
import FilterPresenter from './presenter/filter-presenter';
import CommentsModel from './model/comments-model';
import ApiService from './api-service.js';

const films = Array.from({length: GENERATED_FILMS_COUNT}, generateFilm);

const apiServiceComponent = new ApiService(END_POINT, AUTHORIZATION);
const commentsModel = new CommentsModel();
const filmsModel = new FilmsModel(apiServiceComponent, commentsModel);

const filterModel = new FilterModel();

const headerElement = document.querySelector('.header');
export const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');
const footerStatsElement = footerElement.querySelector('.footer__statistics');

const filmCollectionPresenter = new FilmCollectionPresenter(mainElement, filmsModel, filterModel, commentsModel);
const filterPresenter = new FilterPresenter(mainElement, filterModel, filmsModel);

filterPresenter.init();
filmCollectionPresenter.init();
filmsModel.init();

render(headerElement, new ProfileRankAndAvatarView(filmsModel.films), RenderPosition.BEFORE_END);
render(footerStatsElement, new FilmCountView(filmsModel.films), RenderPosition.BEFORE_END);
