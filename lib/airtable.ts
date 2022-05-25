import Airtable, { FieldSet } from "airtable";
import { CoffeeStoreFields } from "../models/coffee-store";
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_KEY as string);

const table = base("coffee-stores");

const getMinifiedRecord = (record: Airtable.Record<FieldSet>) => ({ ...record.fields, recordId: record.id } as CoffeeStoreFields);

const getMinifiedRecords = (records: Airtable.Records<FieldSet>) => records.map((record) => getMinifiedRecord(record));

const findRecordsByFilter = async (id: string) => {
  const findCoffeeStoreRecords: Airtable.Records<FieldSet> = await table
    .select({
      filterByFormula: `id="${id}"`,
    })
    .firstPage();
  return getMinifiedRecords(findCoffeeStoreRecords);
};

export { table, getMinifiedRecords, findRecordsByFilter };
