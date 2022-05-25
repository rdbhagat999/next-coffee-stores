import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import cls from "classnames";

import { CoffeeStore, CoffeeStoreFields } from "../../models/coffee-store";
import styles from "./CoffeeStorePage.module.scss";
import { useContext, useEffect, useState } from "react";
import { fetcher, isEmpty } from "../../utils";
import { StoreContext } from "../../store/store-context";
import useSWR from "swr";

interface CoffeeStoreProps {
  coffeeStoreDetailData: CoffeeStore;
}

const CoffeeStorePage: React.FC<CoffeeStoreProps> = ({ coffeeStoreDetailData }) => {
  const router = useRouter();
  const {
    state: { coffeeStores },
  } = useContext(StoreContext);
  const id = router.query.id as string;
  const { data: dataFromSwr, error } = useSWR<CoffeeStore[]>(`/api/getCoffeeStoreById?id=${id}`, fetcher);
  const [coffeeStore, setCoffeeStore] = useState<CoffeeStore>(coffeeStoreDetailData || {});
  const [votingCount, setVotingCount] = useState<number>(0);

  const handleCreateCoffeeStore: (coffeeStoreData: CoffeeStore) => void = async (coffeeStoreData) => {
    try {
      const body: CoffeeStoreFields = {
        id: coffeeStoreData.id.toString(),
        name: coffeeStoreData.name,
        imgUrl: coffeeStoreData.imgUrl,
        address: coffeeStoreData.address || "",
        neighbourhood: coffeeStoreData.neighbourhood || "",
        voting: 0,
      };
      await fetch("/api/createCoffeeStore", {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
    } catch (err) {}
  };

  useEffect(() => {
    if (isEmpty(coffeeStoreDetailData)) {
      if (coffeeStores.length > 0) {
        const foundCoffeeStore = coffeeStores.find((coffeStore: CoffeeStore) => coffeStore.id.toString() === id);
        if (foundCoffeeStore) {
          setCoffeeStore(foundCoffeeStore);
          handleCreateCoffeeStore(foundCoffeeStore);
        }
      }
    } else {
      handleCreateCoffeeStore(coffeeStoreDetailData);
    }
  }, [id, coffeeStoreDetailData, coffeeStores]);
  useEffect(() => {
    if (dataFromSwr && dataFromSwr.length > 0) {
      setCoffeeStore(dataFromSwr[0]);
      setVotingCount(dataFromSwr[0].voting);
    }
  }, [dataFromSwr]);
  if (router.isFallback) {
    return <div>Loading Data</div>;
  }

  const { address, name, neighbourhood, imgUrl } = coffeeStore;

  const handleUpvoteButton = async () => {
    try {
      const body = {
        id: id,
      };
      const response = await fetch("/api/favoriteCoffeeStoreById", {
        method: "PUT", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (data && data.length > 0) {
        setVotingCount(data[0].voting);
      }
    } catch (err) {}
  };

  if (error) {
    return <div>Something went wrong retrieving coffee store page</div>;
  }
  return (
    <div className={styles.layout}>
      <Head>
        <title>{name}</title>
        <meta name="description" content={`${name} coffee store`}></meta>
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href="/">
              <a>← Back to home</a>
            </Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
          </div>
          <Image
            src={
              imgUrl ||
              "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
            }
            width={600}
            height={360}
            className={styles.storeImg}
            alt={name}></Image>
        </div>

        <div className={cls("glass", styles.col2)}>
          <div className={styles.iconWrapper}>
            <Image src="/static/icons/places.svg" width="24" height="24" alt="places icon" />
            <p className={styles.text}>{address}</p>
          </div>
          {neighbourhood && (
            <div className={styles.iconWrapper}>
              <Image src="/static/icons/nearMe.svg" width="24" height="24" alt="near me icon" />
              <p className={styles.text}>{neighbourhood}</p>
            </div>
          )}
          <div className={styles.iconWrapper}>
            <Image src="/static/icons/star.svg" width="24" height="24" alt="star icon" />
            <p className={styles.text}>{votingCount}</p>
          </div>

          <button className={styles.upvoteButton} onClick={handleUpvoteButton}>
            Up vote!
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoffeeStorePage;
