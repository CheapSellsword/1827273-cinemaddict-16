import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import durationPlugin from 'dayjs/plugin/duration';
import AbstractObservable from '../utils/abstract-observable';
import { getHumanizedTimeOfComments } from '../utils/dates-and-time';

dayjs.extend(durationPlugin);
dayjs.extend(relativeTime);

export default class CommentsModel extends AbstractObservable {
    #comments = [];

    set comments(comments) {
      this.#comments = [...comments];
    }

    get comments() {
      return this.#comments;
    }

    addComment = (updateType, update, mode, film) => {
      this.#comments = [
        ...this.#comments,
        update,
      ];
      const updatedFilm = {...film, comments: this.#comments};

      this._notify(updateType, mode, updatedFilm);
    }

    deleteComment = (updateType, update, mode, film) => {
      const index = this.#comments.findIndex((comment) => comment.id === update.id);

      if (index === -1) {
        throw new Error('Can\'t delete unexisting comment');
      }
      this.#comments = [
        ...this.#comments.slice(0, index),
        ...this.#comments.slice(index + 1),
      ];
      const updatedFilm = {...film, comments: this.#comments};

      this._notify(updateType, mode, updatedFilm);
    }

    #adaptCommentToClient = (comment) => {
      const adaptedComment = {...comment,
        text: comment['comment'],
        emoji: `./images/emoji/${comment['emotion']}.png`,
        date: getHumanizedTimeOfComments(dayjs(comment['date'])),
      };

      delete adaptedComment.emotion;
      delete adaptedComment.comment;

      return adaptedComment;
    }
}
