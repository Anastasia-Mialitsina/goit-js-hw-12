const API_KEY = '48273516-22e71b99033a61f3653b23d90';
const BASE_URL = 'https://pixabay.com/api/';

export function fetchImages(query, page = 1) {
  const url = `${BASE_URL}?key=${API_KEY}&q=${encodeURIComponent(
    query
  )}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=15`;

  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      if (data.hits.length === 0) {
        throw new Error('No images found');
      }
      return {
        hits: data.hits,
        totalHits: data.totalHits,
      };
    });
}
