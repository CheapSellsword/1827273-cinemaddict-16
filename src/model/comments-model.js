import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import durationPlugin from 'dayjs/plugin/duration';
import AbstractObservable from '../utils/abstract-observable';
import { getHumanizedTimeOfComments } from '../utils/dates-and-time';
import { adaptToClient } from './films-model';

dayjs.extend(durationPlugin);
dayjs.extend(relativeTime);

export default class CommentsModel extends AbstractObservable {
    #comments = [];
    #filmId = null;
    #apiService = null;

    constructor(apiService) {
      super();
      this.#apiService = apiService;
    }

    get comments() {
      return this.#comments;
    }

    init = async (filmId, callback) => {
      let isError = false;
      this.#filmId = filmId;
      this.#apiService.filmId = this.#filmId;
      try {
        const comments = await this.#apiService.comments;
        this.#comments = comments.map(this.#adaptCommentToClient);
      } catch (err) {
        this.#comments = [];
        isError = true;
      }

      callback(isError, this.#comments);
    }

    addComment = async (updateType, mode, update) => {
      this.#apiService.filmId = this.#filmId;
      try {
        const response = await this.#apiService.addComment(update);
        this.#comments = response.comments.map(this.#adaptCommentToClient);
        const updatedFilm = adaptToClient(response.movie);
        this._notify(updateType, mode, updatedFilm);
      } catch (err) {
        throw new Error('Can\'t add comment');
      }
    }

    deleteComment = async (updateType, mode, update, film) => {
      const index = this.#comments.findIndex((comment) => comment.id === update.id);

      if (index === -1) {
        throw new Error('Can\'t delete unexisting comment');
      }

      try {
        await this.#apiService.deleteComment(update);
        this.#comments = [
          ...this.#comments.slice(0, index),
          ...this.#comments.slice(index + 1),
        ];

        const filmComments = [];
        this.#comments.map((comment) => filmComments.push(comment.id));
        const updatedFilm = {...film, comments: filmComments};
        this._notify(updateType, mode, updatedFilm);
      } catch (err) {
        throw new Error('Can\'t delete comment');
      }
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
