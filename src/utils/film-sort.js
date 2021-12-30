export const compareByField = (field) => (a,b) => a[field] < b[field] ? 1 : -1;


export const sortByDate = (filmA, filmB) => Number(filmA.releaseYear) - Number(filmB.releaseYear);

export const sortByRating = (filmA, filmB) => filmA.rating - filmB.rating;
