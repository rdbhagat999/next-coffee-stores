/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { CoffeeStore } from "../models/coffee-store";

import { createApi } from "unsplash-js";

// on your node server
const unsplashApi = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY!,
  //...other fetch options
});

const getUrlForCoffeeStores = (latLong: string, query: string, limit: number) => {
  return `
    https://api.foursquare.com/v3/places/nearby?ll=${latLong}&query=${query}&limit=${limit}
  `;
};

const getListOfCoffeeStorePhotos = async () => {
  const photos = await unsplashApi.search.getPhotos({
    query: "coffee shop",
    perPage: 40,
    orientation: "landscape",
  });
  const unsplashResults = photos.response?.results || [];
  return unsplashResults.map((result) => result.urls["small"]);
};

export const fetchCoffeeStores = async (latLong = "-6.596211761550628,106.80527934402286", limit = 6): Promise<CoffeeStore[]> => {
  const photos = await getListOfCoffeeStorePhotos();

  const response = await fetch(getUrlForCoffeeStores(latLong, "coffee", limit), {
    headers: new Headers({
      Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY!,
    }),
  });
  const data = await response.json();

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?.results?.map((venue: any, idx: number) => {
      const coffeeStore: CoffeeStore = {
        address: venue.location.address,
        name: venue.name,
        id: venue.fsq_id,
        imgUrl:
          photos[idx] ||
          "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80",
        neighbourhood: venue.location.neighborhood || venue.location.crossStreet || "",
        websiteUrl: "",
        voting: 0,
      };
      coffeeStore.neighbourhood = Array.isArray(coffeeStore.neighbourhood) ? coffeeStore.neighbourhood[0] : coffeeStore.neighbourhood;
      return coffeeStore;
    }) || []
  );
};
