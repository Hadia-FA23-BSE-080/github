import fs from 'fs';
import path from 'path';

const getDbPath = () => {
  const dirPath = path.join(process.cwd(), '.data');
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  return path.join(dirPath, 'data.json');
};

const readDb = () => {
  const dbPath = getDbPath();
  if (!fs.existsSync(dbPath)) return { ads: [], users: [] };
  return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
};

const writeDb = (data: any) => {
  fs.writeFileSync(getDbPath(), JSON.stringify(data, null, 2));
};

export const getAds = () => readDb().ads || [];
export const saveAds = (ads: any[]) => {
  const db = readDb();
  db.ads = ads;
  writeDb(db);
};

export const getUsers = () => readDb().users || [];
export const saveUsers = (users: any[]) => {
  const db = readDb();
  db.users = users;
  writeDb(db);
};
