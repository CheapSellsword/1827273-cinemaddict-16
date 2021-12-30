import AbstractView from './abstract-view';

const createEmptySectionTemplate = () => (
  `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title">There are no movies in our database</h2>
    </section>
  </section>`
);

export default class FilmCardView extends AbstractView {

  get template() {
    return createEmptySectionTemplate();
  }
}
