import AbstractView from './abstract-view';
import { FILM_SECTION_TYPES } from '../consts';

const createFilmSectionTemplate = (filmSectionType) => {
  const titleClass = filmSectionType === 'All movies. Upcoming' ? 'visually-hidden' : '';
  const sectionClass = filmSectionType !== 'All movies. Upcoming' ? 'films-list--extra' : '';
  return  `<section class="films-list ${sectionClass}">
            <h2 class="films-list__title ${titleClass}">${filmSectionType}</h2>
            <div class="films-list__container"></div>
          </section>`;
};

const createFilmSection = () => {
  const filmSection = FILM_SECTION_TYPES.map((filmSectionType) => createFilmSectionTemplate(filmSectionType)).join('');
  return `<section class="films">
          ${filmSection}
         </section>`;
};

export default class FilmsSectionView extends AbstractView {

  get template() {
    return createFilmSection();
  }

  get filmContainer() {
    const filmContainer = this.element.querySelector('.films-list__container');
    return filmContainer;
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
    const mostCommentedFilmsContainer = this.mostCommentedSection.querySelector('.films-list__container');
    return mostCommentedFilmsContainer;
  }
}
