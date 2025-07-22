import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { refs } from '../main';
let photo;
function createGallery(images) {
  const img = images
    .map(
      ({
        downloads,
        likes,
        comments,
        views,
        tags,
        webformatURL,
        largeImageURL,
      }) => `
          <li class="gallery-item">
          <a class="gallery-link" href="${largeImageURL}">
          <img class="gallery-image" src="${webformatURL}" alt="${tags}">
          <ul class="info-wrapper">
          <li class="info-item"><span>likes</span>${likes}</li>
          <li class="info-item"><span>Dounloads</span>${downloads}</li>
          <li class="info-item"><span>Comments</span>${comments}</li>
          <li class="info-item"><span>Views</span>${views}</li>
          </ul>
          </a> 
          </li>  
    `
    )
    .join('');

  refs.gallery.insertAdjacentHTML('afterbegin', img);
  if (!photo) {
    photo = new SimpleLightbox('.gallery a', {});
  } else {
    photo.refresh();
  }
}
function clearGallery() {
  refs.gallery.innerHTML = '';
}
function showLoader() {
  refs.loader.classList.add('is-open');
}
function hideLoader() {
  refs.loader.classList.remove('is-open');
}
function showLoadMoreButton() {
  refs.more.classList.remove('hidden');
}
function hideLoadMoreButton() {
  refs.more.classList.add('hidden');
}

export {
  hideLoadMoreButton,
  showLoadMoreButton,
  hideLoader,
  showLoader,
  clearGallery,
  createGallery,
};
