import Head from "next/head";
import Card from "../Card";
import styles from "../HomePage/HomePage.module.scss";
import Banner from "./Banner";
import { CoffeeStore } from "../../models/coffee-store";
import useTrackLocation from "../../hooks/use-track-location";
import { useContext, useEffect, useState } from "react";
import { ACTION_TYPES, StoreContext } from "../../store/store-context";

interface HomePageProps {
  coffeeStoreData: CoffeeStore[];
}

const HomePage: React.FC<HomePageProps> = ({ coffeeStoreData }) => {
  const {
    dispatch,
    state: { coffeeStores, latLong },
  } = useContext(StoreContext);
  const { handleTrackLocation, locationErrorMsg, isFindingLocation } = useTrackLocation();
  const [errorCoffeeStores, setErrorCoffeeStores] = useState<string>("");
  const handleOnBannerBtnClick = () => {
    handleTrackLocation();
  };
  useEffect(() => {
    if (latLong) {
      const fetchData = async () => {
        try {
          const response = await fetch(`/api/getCoffeeStoresByLocation?latLong=${latLong}&limit=30`);
          const fetchedCoffeeStores = await response.json();
          dispatch({ type: ACTION_TYPES.SET_COFFEE_STORES, payload: fetchedCoffeeStores });
        } catch (error) {
          console.log(error);
          setErrorCoffeeStores((error as Error).message);
        }
      };
      fetchData();
    }
  }, [dispatch, latLong]);
  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Connoisseur</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Banner handleOnClick={handleOnBannerBtnClick} buttonText={isFindingLocation ? "Locating..." : "View stores nearby"} />
        {locationErrorMsg && <p>Something went wrong : {locationErrorMsg}</p>}
        {errorCoffeeStores && <p>Something went wrong : {errorCoffeeStores}</p>}
        {coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Coffee Stores Near me</h2>
            <div className={styles.cardLayout}>
              {coffeeStores.map((coffeeStore) => (
                <Card
                  name={coffeeStore.name}
                  href={`/coffee-store/${coffeeStore.id}`}
                  imgUrl={
                    coffeeStore.imgUrl ||
                    "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                  }
                  className={styles.card}
                  key={coffeeStore.id}
                />
              ))}
            </div>
          </div>
        )}
        {coffeeStoreData && coffeeStoreData.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Toronto Stores</h2>
            <div className={styles.cardLayout}>
              {coffeeStoreData.map((coffeeStore) => (
                <Card
                  name={coffeeStore.name}
                  href={`/coffee-store/${coffeeStore.id}`}
                  imgUrl={
                    coffeeStore.imgUrl ||
                    "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                  }
                  className={styles.card}
                  key={coffeeStore.id}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className={styles.footer}></footer>
    </div>
  );
};

export default HomePage;
