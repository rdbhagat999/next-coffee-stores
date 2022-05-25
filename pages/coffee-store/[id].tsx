import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import CoffeeStorePage from "../../components/CoffeeStorePage";
import { CoffeeStore as CoffeeStoreModel } from "../../models/coffee-store";

import { ParsedUrlQuery } from "querystring";
import { fetchCoffeeStores } from "../../lib/coffee-stores";

interface Params extends ParsedUrlQuery {
  id: string;
}

interface CoffeeStoreProps {
  coffeeStore: CoffeeStoreModel;
}

export const getStaticProps: GetStaticProps = async (context) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const params = context.params!; // ! is a non-null assertion
  const id = params.id;
  const coffeeStoresData = await fetchCoffeeStores();

  const coffeeStore = coffeeStoresData.find((coffeStore: CoffeeStoreModel) => coffeStore.id.toString() === id);
  return {
    props: {
      coffeeStore: coffeeStore ?? {},
    }, // will be passed to the page component as props
  };
};

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const coffeeStoresData = await fetchCoffeeStores();
  const paths = coffeeStoresData.map((coffeeStore: CoffeeStoreModel) => ({
    params: {
      id: coffeeStore.id.toString(),
    },
  }));
  return {
    paths,
    fallback: true,
  };
};

const CoffeeStore: NextPage<CoffeeStoreProps> = ({ coffeeStore }) => {
  return <CoffeeStorePage coffeeStoreDetailData={coffeeStore} />;
};

export default CoffeeStore;
