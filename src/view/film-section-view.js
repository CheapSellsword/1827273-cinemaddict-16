import AbstractView from './abstract-view';
import { createElement } from '../utils/render';

const createFilmSectionTemplate = () => (
  `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
      <div class="films-list__container"></div>
    </section>
  </section>`
);

const createTopRatedTemplate = () => (
  `<section class="films-list films-list--extra">
    <h2 class="films-list__title">Top rated</h2>
    <div class="films-list__container"></div>
  </section>`
);

const createMostCommentedTemplate = () => (
  `<section class="films-list films-list--extra">
    <h2 class="films-list__title">Most commented</h2>
    <div class="films-list__container"></div>
  </section>`
);

export default class FilmsSectionView extends AbstractView {
  #topRatedElement = null;
  #mostCommentedElement = null;

  get template() {
    return createFilmSectionTemplate();
  }

  get topRatedTemplate() {
    return createTopRatedTemplate();
  }

  get mostCommentedTemplate() {
    return createMostCommentedTemplate();
  }

  get topRatedSectionElement() {
    if (!this.#topRatedElement) {
      this.#topRatedElement = createElement(this.topRatedTemplate);
    }
    return this.#topRatedElement;
  }

  get mostCommentedSectionElement() {
    if (!this.#mostCommentedElement) {
      this.#mostCommentedElement = createElement(this.mostCommentedTemplate);
    }
    return this.#mostCommentedElement;
  }

  get sectionsContainer() {
    const sectionsContainer = this.filmsListContainer.parentElement;
    return sectionsContainer;
  }

  get filmContainer() {
    const filmContainer = this.filmsListContainer.querySelector('.films-list__container');
    return filmContainer;
  }

  get filmsListContainer() {
    const sectionContainer = this.element.querySelector('.films-list');
    return sectionContainer;
  }

  get topRatedSection() {
    const topRatedFilmSection = this.element.querySelector('.films-list--extra');
    return topRatedFilmSection;
  }

  get topRatedFilmContainer() {
    const topRatedFilmContainer = this.topRatedSection.querySelector('.films-list__container');
    return topRatedFilmContainer;
  }

  get mostCommentedSection() {
    const mostCommentedSection = this.element.querySelector('.films-list--extra:last-child');
    return mostCommentedSection;
  }

  get mostCommentedFilmContainer() {
    const mostCommentedFilmsContainer = this.mostCommentedSectionElement.querySelector('.films-list__container');
    return mostCommentedFilmsContainer;
  }
}
