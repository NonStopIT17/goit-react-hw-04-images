import React, { Component } from 'react';
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

export default class App extends Component {
  state = {
    searchQuery: '',
    images: [],
    page: 1,
    isLoading: false,
    largeImgLink: null,
    imgAlt: null,
    imgOnRequest: 0,
    totalImages: 0,
    error: null,
  };

  async componentDidUpdate(_, prevState) {
    const { searchQuery, page } = this.state;

    if (prevState.searchQuery !== searchQuery || (prevState.page !== page && page !== 1)) {
      this.setState({ isLoading: true });

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

        const shouldReplaceImages = prevState.searchQuery !== searchQuery;

        this.setState(prevState => ({
          searchQuery,
          images: shouldReplaceImages ? imagesData : [...prevState.images, ...imagesData],
          totalImages: total,
          imgOnRequest: hits.length,
        }));
      } catch (error) {
        this.setState({ error });
      } finally {
        this.setState({ isLoading: false });
      }
    }
  }

  handleSearch = searchQuery => {
    this.setState({ searchQuery, page: 1, imgOnRequest: 0, images: [] });
  };

  handleImageClick = event => {
    const { name, alt } = event.target;
    this.setState({
      largeImgLink: name,
      imgAlt: alt,
    });
  };

  handleLoadMoreClick = () => {
    this.setState(prevState => ({
      page: prevState.page + 1,
    }));
  };

  handleCloseModal = () => {
    this.setState({ largeImgLink: null, imgAlt: null });
  };

  render() {
    const {
      images,
      imgAlt,
      largeImgLink,
      isLoading,
      imgOnRequest,
      totalImages,
    } = this.state;

    return (
      <SearchApp>
        <Searchbar onSubmit={this.handleSearch} />
        {images.length > 0 && (
          <ImageGallery items={images} onImgClick={this.handleImageClick} />
        )}
        {largeImgLink && (
          <Modal alt={imgAlt} url={largeImgLink} closeModal={this.handleCloseModal} />
        )}
        {imgOnRequest >= 12 && imgOnRequest < totalImages && !isLoading && (
          <Button onClick={this.handleLoadMoreClick} />
        )}
        {isLoading ? <ThreeDots color="#3f51b5" /> : imgOnRequest > 1 && imgOnRequest === totalImages && (
          <Notification>Photos are finished saving...</Notification>
        )}
        <ToastContainer autoClose={2000} />
        <GlobalStyles />
      </SearchApp>
    );
  }
}
