import type { GetStaticProps, NextPage } from "next";
import HomePage from "../components/HomePage";
import { fetchCoffeeStores } from "../lib/coffee-stores";
import { CoffeeStore } from "../models/coffee-store";

export const getStaticProps: GetStaticProps = async () => {
  const coffeeStores = await fetchCoffeeStores();

  return {
    props: {
      coffeeStores,
    }, // will be passed to the page component as props
  };
};

interface HomeProps {
  coffeeStores: CoffeeStore[];
}

const Home: NextPage<HomeProps> = ({ coffeeStores }) => {
  return (
    <>
      <HomePage coffeeStoreData={coffeeStores} />
    </>
  );
};

export default Home;
