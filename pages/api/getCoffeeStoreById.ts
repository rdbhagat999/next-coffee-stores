import { NextApiRequest, NextApiResponse } from "next";
import { findRecordsByFilter } from "../../lib/airtable";

interface ExtendedNextApiRequest extends NextApiRequest {
  query: {
    id: string;
  };
}

const getCoffeeStoreById = async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  try {
    if (id) {
      const recordsById = await findRecordsByFilter(id);

      if (recordsById.length > 0) {
        res.json(recordsById);
      } else {
        res.status(404).json({ message: "id cannot be found" });
      }
    } else {
      res.status(400).json({ message: "id is missing" });
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

export default getCoffeeStoreById;
