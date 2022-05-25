import { NextApiRequest, NextApiResponse } from "next";
import { CoffeeStoreFields } from "../../models/coffee-store";
import { table, getMinifiedRecords, findRecordsByFilter } from "../../lib/airtable";

interface ExtendedNextApiRequest extends NextApiRequest {
  body: CoffeeStoreFields;
}

const createCoffeeStore = async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      const { id, address, name, neighbourhood, imgUrl, voting } = req.body;
      if (id) {
        const recordsById = await findRecordsByFilter(id);

        if (recordsById.length > 0) {
          res.json(recordsById);
        } else {
          if (name) {
            const createRecords = await table.create([
              {
                fields: {
                  id,
                  name,
                  address,
                  neighbourhood,
                  voting,
                  imgUrl,
                },
              },
            ]);
            const records = getMinifiedRecords(createRecords);
            res.json({ records });
          } else {
            res.status(400).json({ message: "id or name is missing" });
          }
        }
      } else {
        res.status(400).json({ message: "id is missing" });
      }
    } catch (error) {
      res.status(500).json({ message: error });
    }
  } else {
    res.status(400).json({ message: "Bad Request" });
  }
};

export default createCoffeeStore;
