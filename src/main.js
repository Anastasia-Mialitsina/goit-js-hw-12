import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImages } from './js/pixabay-api.js';
import {
  renderGallery,
  showErrorMessage,
  showLoadingIndicator,
  hideLoadingIndicator,
} from './js/render-functions.js';

const form = document.getElementById('search-form');
const input = document.getElementById('search-input');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.getElementById('load-more');

let lightbox = null;
let currentQuery = '';
let page = 1;
const perPage = 15;
let totalHits = 0;

form.addEventListener('submit', async event => {
  event.preventDefault();
  const query = input.value.trim();

  if (query === '') {
    showErrorMessage('Please enter a search query');
    return;
  }

  currentQuery = query;
  page = 1;
  gallery.innerHTML = '';
  loadMoreBtn.classList.add('hidden');
  showLoadingIndicator();

  try {
    const { hits: images, totalHits: total } = await fetchImages(
      currentQuery,
      page
    );
    totalHits = total;

    if (images.length === 0) {
      showErrorMessage(
        'Sorry, there are no images matching your search query. Please try again!'
      );
      return;
    }

    renderGallery(images);
    lightbox = new SimpleLightbox('.gallery a').refresh();

    if (totalHits > perPage) {
      loadMoreBtn.classList.remove('hidden');
    }
  } catch (error) {
    showErrorMessage('An error occurred. Please try again later.');
  } finally {
    hideLoadingIndicator();
  }
});

loadMoreBtn.addEventListener('click', async () => {
  page += 1;
  showLoadingIndicator();

  try {
    const { hits: images } = await fetchImages(currentQuery, page);
    renderGallery(images, true);
    lightbox.refresh();

    const { height: cardHeight } = document
      .querySelector('.gallery-item')
      .getBoundingClientRect();
    window.scrollBy({ top: cardHeight * 2, behavior: 'smooth' });

    if (page * perPage >= totalHits) {
      loadMoreBtn.classList.add('hidden');
      iziToast.info({
        title: 'End',
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    }
  } catch (error) {
    showErrorMessage('An error occurred while loading more images.');
  } finally {
    hideLoadingIndicator();
  }
});
