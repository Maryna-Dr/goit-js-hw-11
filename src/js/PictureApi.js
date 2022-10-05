import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const BASE_URL = 'https://pixabay.com/api/';

export class PictureApi {
  searchQuery;
  currentPage;
  perPage = 40;

  async getPictures(query) {
    if (query === '') {
      throw new Error(
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        )
      );
    }

    if (query) {
      this.searchQuery = query;
    }

    const config = {
      params: {
        key: '30371757-a5b40e590621142e63a85b7cd',
        q: this.searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        page: this.currentPage,
        per_page: this.perPage,
      },
    };

    const response = await axios.get(`${BASE_URL}`, config);
    const data = await response.data;
    return data;

    // return axios.get(`${BASE_URL}`, config).then(response => response.data);
  }
}
