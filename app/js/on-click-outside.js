import * as f from './framework';

export const onClickOutside = elem => {
  f.listenEventAll(elem, 'click', ({ target }) => {
    target.parentNode.classList.toggle('opened');
  });

  f.listenEvent(document, 'mouseup', ({ target }) => {
    if (!target.parentNode.classList.contains('opened')) {
      elem.forEach(dropdown => dropdown.classList.remove('opened'));
    }
  });
};
