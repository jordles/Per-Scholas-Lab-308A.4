import * as Carousel from "./Carousel.js";
import axios from "axios";

// The breed selection input element.
const breedSelect = document.getElementById("breedSelect");
// The information section div element.
const infoDump = document.getElementById("infoDump");
// The progress bar div element.
const progressBar = document.getElementById("progressBar");
// The get favourites button element.
const getFavouritesBtn = document.getElementById("getFavouritesBtn");

// Step 0: Store your API key here for reference and easy access.
const API_KEY =
  "live_WTcre7ZXAfe4km8orUb1BQwhcNCXuD1WV2RhMRdMPH1IsUJ7xPKOqHat5kU8rcWn";
axios.defaults.headers.common["x-api-key"] = API_KEY;
/**
 * 1. Create an async function "initialLoad" that does the following:
 * - Retrieve a list of breeds from the cat API using fetch().
 * - Create new <options> for each of these breeds, and append them to breedSelect.
 *  - Each option should have a value attribute equal to the id of the breed.
 *  - Each option should display text equal to the name of the breed.
 * This function should execute immediately.
 */

// (async function initialLoad() {
//   const breeds = await fetch("https://api.thecatapi.com/v1/breeds");
//   console.log(breeds);
//   const breedData = await breeds.json();
//   for (const obj of breedData) {
//     const option = document.createElement("option");
//     option.textContent = obj.name;
//     breedSelect.appendChild(option);
//   }
//   console.log(breedData);
//   selectBreed();
// })();

/**
 * 2. Create an event handler for breedSelect that does the following:
 * - Retrieve information on the selected breed from the cat API using fetch().
 *  - Make sure your request is receiving multiple array items!
 *  - Check the API documentation if you're only getting a single object.
 * - For each object in the response array, create a new element for the carousel.
 *  - Append each of these new elements to the carousel.
 * - Use the other data you have been given to create an informational section within the infoDump element.
 *  - Be creative with how you create DOM elements and HTML.
 *  - Feel free to edit index.html and styles.css to suit your needs, but be careful!
 *  - Remember that functionality comes first, but user experience and design are important.
 * - Each new selection should clear, re-populate, and restart the Carousel.
 * - Add a call to this function to the end of your initialLoad function above to create the initial carousel.
 */
breedSelect.addEventListener("change", selectBreed);

// async function selectBreed() {
//   const breedSelected = breedSelect.value;
//   const breeds = await fetch("https://api.thecatapi.com/v1/breeds");
//   const breedData = await breeds.json();

//   Carousel.clear();

//   const selectedBreed = breedData.find((breed) => breed.name === breedSelected);

//   // selectedBreedId = obj.id;
//   const breedInfo = await fetch(
//     `https://api.thecatapi.com/v1/images/search?limit=10&breed_ids=${selectedBreed.id}`
//   );
//   const breedImages = await breedInfo.json();
//   console.log(breedImages);
//   breedImages.forEach((breed) => {
//     Carousel.appendCarousel(
//       Carousel.createCarouselItem(breed.url, selectedBreed.name, breed.id)
//     ); // Append new items to the carousel
//   });

//   createBreedInfo(selectedBreed);
//   // Restart the carousel after loading new images
//   Carousel.start();
// }

function createBreedInfo(breed) {
  infoDump.innerHTML = ""; // Clear previous breed info

  const breedInfo = document.createElement("div");
  breedInfo.classList.add("breed-info");

  breedInfo.innerHTML = `
    <h2>${breed.name}</h2>
    <p><strong>Origin:</strong> ${breed.origin}</p>
    <p><strong>Temperament:</strong> ${breed.temperament}</p>
    <p><strong>Description:</strong> ${breed.description}</p>
    <p><strong>Life Span:</strong> ${breed.life_span} years</p>
  `;

  infoDump.appendChild(breedInfo);
}
/**
 * 3. Fork your own sandbox, creating a new one named "JavaScript Axios Lab."
 */
/**
 * 4. Change all of your fetch() functions to axios!
 * - axios has already been imported for you within index.js.
 * - If you've done everything correctly up to this point, this should be simple.
 * - If it is not simple, take a moment to re-evaluate your original code.
 * - Hint: Axios has the ability to set default headers. Use this to your advantage
 *   by setting a default header with your API key so that you do not have to
 *   send it manually with all of your requests! You can also set a default base URL!
 */

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
  // Clear the existing carousel
  Carousel.clear();
  try {
    // Fetching all breed data using axios
    const breedsResponse = await axios.get(
      "https://api.thecatapi.com/v1/breeds",
      {
        onDownloadProgress: updateProgress,
      }
    );
    const breedData = breedsResponse.data;
    console.log("breedData", breedData);

    // Find the selected breed based on the name
    const selectedBreed = breedData.find(
      (breed) => breed.name === breedSelected
    );

    // Fetch breed images based on the selected breed's ID
    const breedImagesResponse = await axios.get(
      `https://api.thecatapi.com/v1/images/search?limit=10&breed_ids=${selectedBreed.id}`,
      {
        onDownloadProgress: updateProgress,
      }
    );
    const breedImages = breedImagesResponse.data;

    // Log breed images
    console.log(breedImages);

    //case for malayan breed
    if (breedImages.length === 0) {
      console.error(`This breed doesn't have an entry!`, breedSelect);
    }
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

/**
 * 5. Add axios interceptors to log the time between request and response to the console.
 * - Hint: you already have access to code that does this!
 * - Add a console.log statement to indicate when requests begin.
 * - As an added challenge, try to do this on your own without referencing the lesson material.
 */

axios.interceptors.request.use((request) => {
  console.log("Request happening here!");
  progressBar.style.width = "0%";
  document.body.style.cursor = "progress";
  return request;
});

axios.interceptors.response.use(
  (response) => {
    console.log("Successful response!");
    document.body.style.cursor = "auto";
    return response;
  },
  (error) => {
    console.log("Unsuccessful response...");
    throw error;
  }
);
/**
 * 6. Next, we'll create a progress bar to indicate the request is in progress.
 * - The progressBar element has already been created for you.
 *  - You need only to modify its "width" style property to align with the request progress.
 * - In your request interceptor, set the width of the progressBar element to 0%.
 *  - This is to reset the progress with each request.
 * - Research the axios onDownloadProgress config option.
 * - Create a function "updateProgress" that receives a ProgressEvent object.
 *  - Pass this function to the axios onDownloadProgress config option in your event handler.
 * - console.log your ProgressEvent object within updateProgess, and familiarize yourself with its structure.
 *  - Update the progress of the request using the properties you are given.
 * - Note that we are not downloading a lot of data, so onDownloadProgress will likely only fire
 *   once or twice per request to this API. This is still a concept worth familiarizing yourself
 *   with for future projects.
 */
function updateProgress(event) {
  console.log("progress event: ", event);
  if (event.progress) {
    const percentCompleted = Math.round((event.loaded * 100) / event.total);
    progressBar.style.width = `${percentCompleted}%`; // Update progress bar width
  } else {
    console.log("Progress is not computable.");
  }
}
/**
 * 7. As a final element of progress indication, add the following to your axios interceptors:
 * - In your request interceptor, set the body element's cursor style to "progress."
 * - In your response interceptor, remove the progress cursor style from the body element.
 */

/**
 * 8. To practice posting data, we'll create a system to "favourite" certain images.
 * - The skeleton of this function has already been created for you.
 * - This function is used within Carousel.js to add the event listener as items are created.
 *  - This is why we use the export keyword for this function.
 * - Post to the cat API's favourites endpoint with the given ID.
 * - The API documentation gives examples of this functionality using fetch(); use Axios!
 * - Add additional logic to this function such that if the image is already favourited,
 *   you delete that favourite using the API, giving this function "toggle" functionality.
 * - You can call this function by clicking on the heart at the top right of any image.
 */
export async function favourite(imgId) {
  try {
    //get list of favourites
    const favouritesResponse = await axios.get(
      `https://api.thecatapi.com/v1/favourites`
    );

    if (
      favouritesResponse.data.some((favourite) => favourite.image_id === imgId)
    ) {
      const image = favouritesResponse.data.find(
        (favourite) => favourite.image.id === imgId
      );

      console.log("Already favorited, deleting...");
      await axios.delete(`https://api.thecatapi.com/v1/favourites/${image.id}`);
      console.log(`Deleted ${imgId}`);
      return;
    }

    await axios.post(`https://api.thecatapi.com/v1/favourites`, {
      image_id: imgId,
    });

    console.log(`Added favorited cat picture ${imgId}`);
  } catch (err) {
    console.error(`Error cannot favourite cat...`, err);
  }
}

/**
 * 9. Test your favourite() function by creating a getFavourites() function.
 * - Use Axios to get all of your favourites from the cat API.
 * - Clear the carousel and display your favourites when the button is clicked.
 *  - You will have to bind this event listener to getFavouritesBtn yourself.
 *  - Hint: you already have all of the logic built for building a carousel.
 *    If that isn't in its own function, maybe it should be so you don't have to
 *    repeat yourself in this section.
 */

getFavouritesBtn.removeEventListener("click", getFavourites); // Prevent duplicate listeners
getFavouritesBtn.addEventListener("click", getFavourites);

async function getFavourites() {
  const favourites = await axios.get(`https://api.thecatapi.com/v1/favourites`);
  console.log(favourites.data);

  Carousel.clear();
  for (const cat of favourites.data) {
    const getName = await axios.get(
      `https://api.thecatapi.com/v1/images/${cat.image_id}`
    );
    const catName = getName.data.breeds[0].name;
    console.log(catName);
    Carousel.appendCarousel(
      Carousel.createCarouselItem(cat.image.url, catName, cat.id)
    );
  }

  // Carousel.start();
}
/**
 * 10. Test your site, thoroughly!
 * - What happens when you try to load the Malayan breed?
 *  - If this is working, good job! If not, look for the reason why and fix it!
 * - Test other breeds as well. Not every breed has the same data available, so
 *   your code should account for this.
 */
//made a test case for malayan breed to print an error since its empty
