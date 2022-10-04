import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Pictures } from './api';

// Notify.success('Sol lucet omnibus');
//Notify.failure('Qui timide rogat docet negare');
//Notify.warning('Memento te hominem esse');
//Notify.info('Cogito ergo sum');

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('gallery'),
  loadMoreBtn: document.querySelector('.is-hidden'),
};

refs.form.addEventListener('submit', onFormSubmit);

function onFormSubmit(e) {
  e.preventDefault();

  const searchQuery = e.target.elements.searchQuery.value;

  const pictures = new Pictures();
  pictures.getPictures(searchQuery);
}
