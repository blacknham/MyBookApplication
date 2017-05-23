import { Injectable } from '@angular/core';
import * as PouchDB from 'pouchdb';
import cordovaSqlitePlugin from 'pouchdb-adapter-cordova-sqlite';

@Injectable()
export class LoginService {  
    private _db;
    private _signin;

    initDB() {
        PouchDB.plugin(cordovaSqlitePlugin);
        this._db = new PouchDB('signin.db', { adapter: 'cordova-sqlite' });
    }

    add(signin) {  
        return this._db.post(signin);
    }

    update(signin) {  
        return this._db.put(signin);
    }

    delete(signin) {  
        return this._db.remove(signin);
    }

    getAll() {  

        if (!this._signin) {
            return this._db.allDocs({ include_docs: true})
                .then(docs => {

                    // Each row has a .doc object and we just want to send an 
                    // array of birthday objects back to the calling controller,
                    // so let's map the array to contain just the .doc objects.

                    this._signin = docs.rows.map(row => {
                        // Dates are not automatically converted from a string.
                        row.doc.Date = new Date(row.doc.Date);
                        return row.doc;
                    });

                    // Listen for changes on the database.
                    this._db.changes({ live: true, since: 'now', include_docs: true})
                        .on('change', this.onDatabaseChange);

                    return this._signin;
                });
        } else {
            // Return cached data as a promise
            return Promise.resolve(this._signin);
        }
    }

    private onDatabaseChange = (change) => {  
        var index = this.findIndex(this._signin, change.id);
        var signin = this._signin[index];

        if (change.deleted) {
            if (signin) {
                this._signin.splice(index, 1); // delete
            }
        } else {
            change.doc.Date = new Date(change.doc.Date);
            if (signin && signin._id === change.id) {
                this._signin[index] = change.doc; // update
            } else {
                this._signin.splice(index, 0, change.doc) // insert
            }
        }
    }

    // Binary search, the array is by default sorted by _id.
    private findIndex(array, id) {  
        var low = 0, high = array.length, mid;
        while (low < high) {
        mid = (low + high) >>> 1;
        array[mid]._id < id ? low = mid + 1 : high = mid
        }
        return low;
    }

}