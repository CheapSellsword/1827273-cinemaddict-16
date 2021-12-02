export const createSortAndStatsBar = (filters, isChecked) => {

  const filterClassName = isChecked
    ? 'main-navigation__item--active'
    : '';

  return `<nav class="main-navigation">
          <div class="main-navigation__items">
            <a href="#${filters[0].name}" class="main-navigation__item ${filterClassName}">All movies</a>
            <a href="#${filters[1].name}" class="main-navigation__item ${filterClassName}">Watchlist <span class="main-navigation__item-count">${filters[1].count}</span></a>
            <a href="#${filters[2].name}" class="main-navigation__item ${filterClassName}">History <span class="main-navigation__item-count">${filters[2].count}</span></a>
            <a href="#${filters[3].name}" class="main-navigation__item ${filterClassName}">Favorites <span class="main-navigation__item-count">${filters[3].count}</span></a>
          </div>
          <a href="#stats" class="main-navigation__additional">Stats</a>
        </nav>

        <ul class="sort">
          <li><a href="#" class="sort__button sort__button--active">Sort by default</a></li>
          <li><a href="#" class="sort__button">Sort by date</a></li>
          <li><a href="#" class="sort__button">Sort by rating</a></li>
        </ul>`;
};

