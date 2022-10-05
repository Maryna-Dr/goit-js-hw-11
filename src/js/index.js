// ##### all imports
import axios from 'axios';

import { Notify } from 'notiflix/build/notiflix-notify-aio';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { PictureApi } from './PictureApi';

// ##### script
const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.is-hidden'),
};


// console.log(a)

const pictureApi = new PictureApi();

// ##### eventListener and fn for them 
refs.form.addEventListener('submit', onFormSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);

function onFormSubmit(e) {
  e.preventDefault();
  query = e.target.elements.searchQuery.value;

  pictureApi.currentPage = 1;

  pictureApi
    .getPictures(query)
    .then(data => {
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
      new SimpleLightbox('.photo-lg');
    })
    .catch(e => Notify.failure(e.message));
}

function onLoadMoreBtnClick() {
  pictureApi.currentPage += 1;
  pictureApi.getPictures().then(data => {
    addMarkupToGallery(data.hits);

    initScroll();

    if (pictureApi.currentPage * pictureApi.perPage > data.totalHits) {
      hiddenBtn();
      Notify.info("We're sorry, but you've reached the end of search results.");
    }
  });
}

// ##### fn for create and add markup
function addMarkupToGallery(obj) {
  const markup = obj
    .map(it => {
      return createMarkup(
        it.webformatURL,
        it.largeImageURL,
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

function createMarkup(imgSmall, imgLarge, tag, like, view, comment, download) {
  return `<div class="photo-card">
  <a class="photo-lg" href="${imgLarge}">
  <div class="thumb">
  <img src="${imgSmall}" alt="${tag}" loading="lazy"/>
      </div>
      </a>
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

// ##### secondary fn
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

function initScroll() {
  const rect = refs.gallery.firstElementChild.getBoundingClientRect();
  
    window.scrollBy({
      top: rect.height * 2.4,
      behavior: "smooth",
    });
}
