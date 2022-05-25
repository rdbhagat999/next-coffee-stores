// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { fetchCoffeeStores } from "../../lib/coffee-stores";
import { CoffeeStore } from "../../models/coffee-store";

type Data = CoffeeStore[] | { message: string; error: unknown };

export default async function getCoffeeStoresByLocation(req: NextApiRequest, res: NextApiResponse<Data>) {
  try {
    const { latLong, limit } = req.query;
    const fetchedCoffeeStores = await fetchCoffeeStores(latLong as string, +limit);
    res.status(200).json(fetchedCoffeeStores);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
}
