/**
 * Created by arShown on 2017/3/8.
 */
export default class StorageLibrary {
    store:{
        [key:string]:any
    };

    constructor() {
        this.restore();
    }

    restore():void {
        this.store = {};
    }

    /**
     * set(key, value)  => { key : value}}
     * @returns {StorageLibrary}
     */
    set(keyOrObject:string, value:any):StorageLibrary {
        Object.assign(this.store, {
            [keyOrObject]: value
        });
        return this;
    }

    /**
     * 回傳資料內容
     * get() 無傳入參數，回傳所有資料內容
     * get(key) 傳入單一值，回傳該值資料
     * @returns {any}
     */
    get(key?:string):?any {
        if (!key)
            return this.store;
        return this.store[key] || null;
    }

    /**
     * remove(key1, key2,...)
     * @returns {StorageLibrary}
     */
    remove(...keys?:Array<string>):StorageLibrary {
        const store = Object.assign({}, this.store);
        const filterKeys = Object.keys(store).filter(storeKey => !(keys.includes(storeKey)));
        this.store = filterKeys.reduce((obj, storeKey) => {
            obj[storeKey] = store[storeKey];
            return obj;
        }, {});
        return this;
    }

    /**
     * 判斷key是否有value
     * @returns {boolean}
     */
    exists(key:string):boolean {
        return Object.keys(this.store).includes(key);
    }

    /**
     * 資料筆數
     * @returns {Number}
     */
    length():number {
        return Object.keys(this.store).length;
    }
}
