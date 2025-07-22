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
    iziToast.error({
      title: '(',
      message: 'Field search can t be empty',
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
        message: 'sorry,try again',
        position: 'topRight',
      });
      return;
    } else {
      createGallery(responseData.hits);
      console.log(responseData.hits);

      if (responseData.totalHits > page * PER_PAGE) {
        showLoadMoreButton();
      }
    }
  } catch (error) {
    iziToast.error({
      title: '(',
      message: 'sorry',
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
    if (newResponseData.totalHits <= page * PER_PAGE) {
      hideLoadMoreButton();
      iziToast.info({
        title: '*',
        message: 'This is all images ',
        position: 'topRight',
      });
    } else {
      createGallery(newResponseData.hits);
      showLoadMoreButton();
    }
  } catch (error) {
    iziToast.error({
      title: '(',
      message: 'sorry',
    });
    console.log(error);
    hideLoadMoreButton();
  } finally {
    hideLoader();
  }
}
