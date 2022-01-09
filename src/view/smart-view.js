import AbstractView from './abstract-view';

export default class SmartView extends AbstractView {
    _data = {};

    updateData = (update) => {
      if (update) {
        this._data = {...this._data, ...update};

        this.updateElement();
      }
    }

    updateTextData = (update, justDataUpdating) => {
      if (justDataUpdating) {
        this._data = {...this._data, ...update};
      }
    }

    updateElement = () => {
      const prevElement = this.element;
      const prevScrollPosition = prevElement.scrollTop;
      const parent = prevElement.parentElement;
      this.removeElement();

      const newElement = this.element;

      parent.replaceChild(newElement, prevElement);

      this.restoreHandlers();

      newElement.scrollTop = prevScrollPosition;
    }

    restoreHandlers = () => {
      throw new Error('Abstract method not implemented: restoreHandlers');
    }
}

