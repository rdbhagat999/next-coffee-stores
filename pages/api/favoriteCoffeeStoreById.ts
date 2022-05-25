import { NextApiRequest, NextApiResponse } from "next";
import { findRecordsByFilter, table, getMinifiedRecords } from "../../lib/airtable";

interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    id: string;
  };
}

const favoriteCoffeeStoreById = async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
  const { id } = req.body;

  if (req.method === "PUT") {
    try {
      if (id) {
        const recordsById = await findRecordsByFilter(id);
        if (recordsById.length > 0) {
          const [record] = recordsById;
          const { voting, recordId } = record;
          console.log("fields: ", voting, record);
          const calucateVoting = voting !== undefined ? +voting + 1 : 0;
          if (recordId) {
            const updateRecord = await table.update([
              {
                id: recordId,
                fields: {
                  voting: calucateVoting,
                },
              },
            ]);
            if (updateRecord) {
              res.json(getMinifiedRecords(updateRecord));
            }
          }
        } else {
          res.status(404).json({ message: "Coffee store id doesn't exist", id });
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

export default favoriteCoffeeStoreById;
