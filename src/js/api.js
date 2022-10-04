import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';

export class Pictures {
  getPictures(query) {
    const config = {
      params: {
        key: '30371757-a5b40e590621142e63a85b7cd',
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
      },
    };

    return axios
      .get(`${BASE_URL}`, config)
      .then(response => console.log(response.data));
  }
}
