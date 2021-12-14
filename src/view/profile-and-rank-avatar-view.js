import { RANKS, NOVICE_FILM_COUNT, FAN_FILM_COUNT, MOVIE_BUFF_FILM_COUNT, GENERATED_FILMS_COUNT } from '../consts';
import AbstractView from './abstract-view';

const createRank = (filmCount) => {
  let rank = '';

  if (filmCount >= NOVICE_FILM_COUNT && filmCount < FAN_FILM_COUNT) {
    rank = RANKS.NOVICE;

  } else if (filmCount >= FAN_FILM_COUNT && filmCount < MOVIE_BUFF_FILM_COUNT) {
    rank = RANKS.FAN;

  } else if (filmCount >= MOVIE_BUFF_FILM_COUNT) {
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
