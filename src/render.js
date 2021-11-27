export const RenderPosition = {
  BEFORE_BEGIN: 'beforebegin',
  AFTER_BEGIN: 'afterbegin',
  BEFORE_END: 'beforeend',
  AFTER_END: 'afterend',
};

export const renderTemplate = (container, template, place = RenderPosition.AFTER_BEGIN) => {
  container.insertAdjacentHTML(place, template);
};
