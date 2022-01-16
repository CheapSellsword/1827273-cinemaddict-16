import AbstractObservable from '../utils/abstract-observable';

export default class CommentsModel extends AbstractObservable {
    #comments = [];

    set comments(comments) {
      this.#comments = [...comments];
    }

    get comments() {
      return this.#comments;
    }

    addComment = (updateType, update, film) => {
      this.#comments = [
        ...this.#comments,
        update,
      ];
      const updatedFilm = {...film, comments: this.#comments};

      this._notify(updateType, updatedFilm);
    }

    deleteComment = (updateType, update, film) => {
      const index = this.#comments.findIndex((comment) => comment.id === update.id);

      if (index === -1) {
        throw new Error('Can\'t delete unexisting comment');
      }
      this.#comments = [
        ...this.#comments.slice(0, index),
        ...this.#comments.slice(index + 1),
      ];
      const updatedFilm = {...film, comments: this.#comments};

      this._notify(updateType, updatedFilm);
    }
}
