import { RANKS, FILMS_COUNT_FOR_RANK, GENERATED_FILMS_COUNT } from '../consts';
import AbstractView from './abstract-view';

const createRank = (filmCount) => {
  let rank = '';

  if (filmCount >= FILMS_COUNT_FOR_RANK.NOVICE && filmCount < FILMS_COUNT_FOR_RANK.FAN) {
    rank = RANKS.NOVICE;

  } else if (filmCount >= FILMS_COUNT_FOR_RANK.FAN && filmCount < FILMS_COUNT_FOR_RANK.MOVIE_BUFF) {
    rank = RANKS.FAN;

  } else if (filmCount >= FILMS_COUNT_FOR_RANK.MOVIE_BUFF) {
    rank = RANKS.MOVIE_BUFF;

  } else {
    rank = '';
  }

  return rank;
};

const createProfileRankAndAvatar = () => (
  `<section class="header__profile profile">
    <p class="profile__rating">${createRank(GENERATED_FILMS_COUNT)}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`
);

export default class ProfileRankAndAvatarView extends AbstractView {

  get template() {
    return createProfileRankAndAvatar();
  }
}
