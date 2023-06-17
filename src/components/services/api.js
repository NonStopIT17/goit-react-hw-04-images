import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '35915141-b6dbe9ffcdcece473600962ee';
const REQUEST_PARAM = 'image_type=photo&orientation=horizontal&per_page=12';

export const fetchImagesWithQuery = async (searchQuery, page = 1) => {
  const response = axios.get(
    `${BASE_URL}?q=${searchQuery}&page=${page}&key=${API_KEY}&${REQUEST_PARAM}`
  );
  return response;
};

