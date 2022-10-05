import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { PictureApi } from './PictureApi';

// Notify.success('Sol lucet omnibus');
//Notify.failure('Qui timide rogat docet negare');
//Notify.warning('Memento te hominem esse');
//Notify.info('Cogito ergo sum');

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.is-hidden'),
};

const pictureApi = new PictureApi();

refs.form.addEventListener('submit', onFormSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);

function onFormSubmit(e) {
  e.preventDefault();
  query = e.target.elements.searchQuery.value;

  pictureApi.currentPage = 1;
  pictureApi.getPictures(query).then(data => {
    if (data.hits.length === 0) {
      clearGallery(refs.gallery);
      hiddenBtn();
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    clearGallery(refs.gallery);
    hiddenBtn();

    Notify.success(`Hooray! We found ${data.totalHits} images.`);
    addMarkupToGallery(data.hits);
  });

  //  .catch (e) {
  //     e;
  //   }
}

function onLoadMoreBtnClick() {
  pictureApi.currentPage += 1;
  pictureApi.getPictures().then(data => {
    addMarkupToGallery(data.hits);

    if (
      Number(pictureApi.currentPage * pictureApi.perPage) >
      Number(data.totalHits)
    ) {
      hiddenBtn();
      Notify.info("We're sorry, but you've reached the end of search results.");
    }
  });
}

function addMarkupToGallery(obj) {
  const markup = obj
    .map(it => {
      return createMarkup(
        it.webformatURL,
        it.tags,
        it.likes,
        it.views,
        it.comments,
        it.downloads
      );
    })
    .join('');

  refs.gallery.insertAdjacentHTML('beforeend', markup);
  showBtn();
  return;
}

function createMarkup(imgSmall, tag, like, view, comment, download) {
  return `<div class="photo-card">
  <div class="thumb">
  <img src="${imgSmall}" alt="${tag}" loading="lazy"/>
      </div>
      <div class="info">
        <p class="info-item">
          <b>Likes</b> ${like}
        </p>
        <p class="info-item">
          <b>Views</b> ${view}
        </p>
        <p class="info-item">
          <b>Comments</b> ${comment}
        </p>
        <p class="info-item">
          <b>Downloads</b> ${download}
        </p>
      </div>
    </div>`;
}

function clearGallery(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function hiddenBtn() {
  refs.loadMoreBtn.classList.add('is-hidden');
  refs.loadMoreBtn.classList.remove('load-more');
}

function showBtn() {
  refs.loadMoreBtn.classList.add('load-more');
  refs.loadMoreBtn.classList.remove('is-hidden');
}
