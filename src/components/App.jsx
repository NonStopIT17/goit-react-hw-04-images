import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as API from './services/api';
import GlobalStyles from './GlobalStyles';
import Searchbar from './Searchbar';
import ImageGallery from './ImageGallery';
import Modal from './Modal';
import Button from './Button';
import Notification from './Notification';
import { SearchApp } from './App.styled';
import { ThreeDots } from 'react-loader-spinner';

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [largeImgLink, setLargeImgLink] = useState(null);
  const [imgAlt, setImgAlt] = useState(null);
  const [imgOnRequest, setImgOnRequest] = useState(0);
  const [totalImages, setTotalImages] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (searchQuery === '') return;

      setIsLoading(true);

      try {
        const response = await API.fetchImagesWithQuery(searchQuery, page);
        const { hits, total } = response.data;

        if (hits.length === 0) {
          toast.error('Nothing found for your request', { icon: '👻' });
          return;
        }

        const imagesData = hits.map(image => ({
          id: image.id,
          webformatURL: image.webformatURL,
          largeImageURL: image.largeImageURL,
          tags: image.tags,
        }));

        if (page === 1) {
          setImages(imagesData);
        } else {
          setImages(prevImages => [...prevImages, ...imagesData]);
        }

        setTotalImages(total);
        setImgOnRequest(hits.length);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [searchQuery, page]);

  const handleSearch = searchQuery => {
    setSearchQuery(searchQuery);
    setPage(1);
    setImgOnRequest(0);
    setImages([]);
  };

  const handleImageClick = event => {
    const { name, alt } = event.target;
    setLargeImgLink(name);
    setImgAlt(alt);
  };

  const handleLoadMoreClick = () => {
    setPage(prevPage => prevPage + 1);
  };

  const handleCloseModal = () => {
    setLargeImgLink(null);
    setImgAlt(null);
  };

  return (
    <SearchApp>
      <Searchbar onSubmit={handleSearch} />
      {images.length > 0 && <ImageGallery items={images} onImgClick={handleImageClick} />}
      {largeImgLink && <Modal alt={imgAlt} url={largeImgLink} closeModal={handleCloseModal} />}
      {imgOnRequest >= 12 && imgOnRequest < totalImages && !isLoading && (
        <Button onClick={handleLoadMoreClick} />
      )}
      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
          <ThreeDots color="#3f51b5" />
        </div>
      ) : imgOnRequest > 1 && imgOnRequest === totalImages && (
        <Notification>Photos are finished saving...</Notification>
      )}
      <ToastContainer autoClose={2000} />
      <GlobalStyles />
    </SearchApp>
  );
};

export default App;

