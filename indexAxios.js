import * as Carousel from "./Carousel.js";
import axios from "axios";

//USED IN ACTUAL CODE AS WELL

(async function initialLoad() {
  try {
    // Using axios to get the breed data
    const breedsResponse = await axios.get(
      "https://api.thecatapi.com/v1/breeds"
    );
    const breedData = breedsResponse.data;

    // Populate breedSelect with the options
    for (const obj of breedData) {
      const option = document.createElement("option");
      option.textContent = obj.name;
      breedSelect.appendChild(option);
    }

    console.log(breedData);

    // Call selectBreed to initialize the carousel
    selectBreed();
  } catch (error) {
    console.error("Error fetching breed data:", error);
  }
})();

async function selectBreed() {
  const breedSelected = breedSelect.value;

  try {
    // Fetching all breed data using axios
    const breedsResponse = await axios.get(
      "https://api.thecatapi.com/v1/breeds"
    );
    const breedData = breedsResponse.data;

    // Clear the existing carousel
    Carousel.clear();

    // Find the selected breed based on the name
    const selectedBreed = breedData.find(
      (breed) => breed.name === breedSelected
    );

    // Fetch breed images based on the selected breed's ID
    const breedImagesResponse = await axios.get(
      `https://api.thecatapi.com/v1/images/search?limit=10&breed_ids=${selectedBreed.id}`
    );
    const breedImages = breedImagesResponse.data;

    // Log breed images
    console.log(breedImages);

    // Loop through breed images and append each to the carousel
    breedImages.forEach((breed) => {
      Carousel.appendCarousel(
        Carousel.createCarouselItem(breed.url, selectedBreed.name, breed.id)
      );
    });

    // Create breed info section
    createBreedInfo(selectedBreed);

    // Restart the carousel after loading new images
    Carousel.start();
  } catch (error) {
    console.error("Error fetching breed data or images:", error);
  }
}
