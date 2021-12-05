export const createSortAndStatsBar = (filters, isChecked) => {

  const filterClassName = isChecked
    ? 'main-navigation__item--active'
    : '';

  const createFiltersTemplate = () => filters.map((filter) => {
    if(filter.name === 'All movies') {
      return `<a href="#${filter.href}" class="main-navigation__item ${filterClassName}">${filter.name}</a>`;
    }
    return `<a href="#${filter.href}" class="main-navigation__item ${filterClassName}">${filter.name} <span class="main-navigation__item-count">${filter.count}</span></a>`;
  }).join('');

  return `<nav class="main-navigation">
            <div class="main-navigation__items">
             ${createFiltersTemplate()}
            </div>
            <a href="#stats" class="main-navigation__additional">Stats</a>
          </nav>

        <ul class="sort">
          <li><a href="#" class="sort__button sort__button--active">Sort by default</a></li>
          <li><a href="#" class="sort__button">Sort by date</a></li>
          <li><a href="#" class="sort__button">Sort by rating</a></li>
        </ul>`;
};

