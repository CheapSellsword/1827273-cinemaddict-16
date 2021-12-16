import { RANKS, FILMS_COUNT_FOR_RANK } from '../consts';
import { films } from '../main';
import AbstractView from './abstract-view';

const createRank = (filmsCount) => {
  let rank = '';

  if (filmsCount >= FILMS_COUNT_FOR_RANK.NOVICE && filmsCount < FILMS_COUNT_FOR_RANK.FAN) {
    rank = RANKS.NOVICE;

  } else if (filmsCount >= FILMS_COUNT_FOR_RANK.FAN && filmsCount < FILMS_COUNT_FOR_RANK.MOVIE_BUFF) {
    rank = RANKS.FAN;

  } else if (filmsCount >= FILMS_COUNT_FOR_RANK.MOVIE_BUFF) {
    rank = RANKS.MOVIE_BUFF;

  } else {
    rank = '';
  }

  return rank;
};

const createProfileRankAndAvatar = (filmsCount) => (
  `<section class="header__profile profile">
    <p class="profile__rating">${createRank(filmsCount)}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`
);

export default class ProfileRankAndAvatarView extends AbstractView {

  get template() {
    return createProfileRankAndAvatar(films.length);
  }
}
