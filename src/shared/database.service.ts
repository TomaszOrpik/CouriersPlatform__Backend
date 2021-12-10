import { initializeApp } from '@firebase/app';
import { getDatabase, Database, ref, get, set } from '@firebase/database';
import { Injectable } from '@nestjs/common';
import { firebaseConfig } from '../../firebase-config';

@Injectable()
export class DatabaseService {
  db: Database;

  constructor() {
    const app = initializeApp(firebaseConfig);
    this.db = getDatabase(app);
  }

  async getCollection(name: string) {
    return (await get(ref(this.db, name))).val();
  }
  async addUpdateItemCollection(name: string, id: string, data: unknown) {
    await set(ref(this.db, `${name}/${id}`), data);
  }
  async getItemById(name: string, id: string) {
    return await (await get(ref(this.db, `${name}/${id}`))).val();
  }

  get Database() {
    return this.db;
  }
}
