import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import {
  createGallery,
  clearGallery,
  hideLoader,
  showLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions';
import { getImagesByQuery } from './js/pixabay-api';

export const refs = {
  form: document.querySelector('.form'),
  loader: document.querySelector('.loader'),
  gallery: document.querySelector('.gallery'),
  btn: document.querySelector('.search-button'),
  input: document.querySelector('input[name="search-text"]'),
  more: document.querySelector('.load-more'),
};

refs.form.addEventListener('submit', onSubmit);
refs.more.addEventListener('click', loadMore);

const PER_PAGE = 15;
let page;
let query = '';

async function onSubmit(event) {
  event.preventDefault();

  page = 1;
  query = refs.input.value.trim();

  if (!query) {
    iziToast.info({
      title: '(',
      message: 'You must enter something to search.',
      position: 'topRight',
    });
    return;
  }
  clearGallery();
  hideLoadMoreButton();
  showLoader();
  try {
    const responseData = await getImagesByQuery(query, page);
    if (responseData.hits.length === 0) {
      iziToast.error({
        title: '(',
        message: `Sorry, no images found matching your search ${query}. Please try again!`,
        position: 'topRight',
      });
      return;
    } else {
      createGallery(responseData.hits);

      if (responseData.totalHits > page * PER_PAGE) {
        showLoadMoreButton();
      } else {
        hideLoadMoreButton();
        iziToast.info({
          title: '*',
          message: "We're sorry, but you've reached the end of search results.",
          position: 'topRight',
        });
      }
    }
  } catch (error) {
    iziToast.error({
      title: '(',
      message: `Something went wrong! Please try your search again.${error}`,
    });
    console.log(error);
  } finally {
    hideLoader();
    refs.form.reset();
  }
}
async function loadMore() {
  page += 1;
  hideLoadMoreButton();
  showLoader();
  try {
    const newResponseData = await getImagesByQuery(query, page);

    createGallery(newResponseData.hits);

    const { height: cardHeight } =
      refs.gallery.firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });

    if (newResponseData.totalHits <= page * PER_PAGE) {
      hideLoadMoreButton();
      iziToast.info({
        title: '*',
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    } else {
      showLoadMoreButton();
    }
  } catch (error) {
    iziToast.error({
      title: '(',
      message: `Something went wrong! Please try your search again.${error}`,
    });
    console.log(error);
    hideLoadMoreButton();
  } finally {
    hideLoader();
  }
}
