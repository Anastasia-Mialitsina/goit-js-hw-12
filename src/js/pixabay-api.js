import axios from 'axios';

const API_KEY = '48273516-22e71b99033a61f3653b23d90';
const BASE_URL = 'https://pixabay.com/api/';
const PER_PAGE = 15;

export async function fetchImages(query, page = 1) {
  try {
    const url = `${BASE_URL}?key=${API_KEY}&q=${encodeURIComponent(
      query
    )}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${PER_PAGE}&page=${page}`;

    const response = await axios.get(url);
    const data = response.data;

    if (data.hits.length === 0) {
      throw new Error('No images found');
    }

    return { images: data.hits, totalHits: data.totalHits };
  } catch (error) {
    console.error('Ошибка запроса:', error);
    throw error;
  }
}
