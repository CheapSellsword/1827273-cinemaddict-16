import AbstractView from './abstract-view';

const createTopRatedTemplate = (films) => {
  if (films.length) {
    return   `<section class="films-list films-list--extra">
               <h2 class="films-list__title">Top rated</h2>
               <div class="films-list__container"></div>
             </section>`;
  }
  return `<section class="films-list films-list--extra">
         </section>`;
};

const createMostCommentedTemplate = (films) => {
  if (films.length) {
    return   `<section class="films-list films-list--extra">
               <h2 class="films-list__title">Most commented</h2>
               <div class="films-list__container"></div>
             </section>`;
  }
  return `<section class="films-list films-list--extra">
         </section>`;
};

const createFilmSectionsTemplate = (topRatedFilms, mostCommentedFilms) => (
  `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
      <div class="films-list__container"></div>
    </section>
    ${createTopRatedTemplate(topRatedFilms)}
    ${createMostCommentedTemplate(mostCommentedFilms)}
  </section>`
);

export default class FilmsSectionView extends AbstractView {
  #topRatedFilms = null;
  #mostCommentedFilms = null;

  constructor(topRatedFilms, mostCommentedFilms) {
    super();
    this.#topRatedFilms = topRatedFilms;
    this.#mostCommentedFilms = mostCommentedFilms;
  }

  get template() {
    return createFilmSectionsTemplate(this.#topRatedFilms, this.#mostCommentedFilms);
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
