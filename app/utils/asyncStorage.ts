import AsyncStorage from "@react-native-async-storage/async-storage";

const save = async (key: string, value: string) => {
    await AsyncStorage.setItem(key, value);
};

const get = async (key: string) => {
    return await AsyncStorage.getItem(key);
};

const remove = async (key: string) => {
    await AsyncStorage.removeItem(key);
};

const clear = async () => {
    await AsyncStorage.clear();
};

const asyncStorage = {
    save,
    get,
    remove,
    clear,
};

export enum Keys {
  AUTH_TOKEN = "access-token",       
  REFRESH_TOKEN = "refresh-token", 
}

export default asyncStorage;