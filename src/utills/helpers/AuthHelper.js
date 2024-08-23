import { getData } from "../local-storage";
import { keys } from "../local-storage/keys";

export const ObjectToJSON = (value) => JSON.stringify(value);
export const JSONToObject = (value) => JSON.parse(value);

export const getUserDetails = access_token => {
    if (access_token) {
        return JSON.parse(Buffer.from(access_token.split('.')[1], 'base64').toString());
    }
    return null;
};

export const isUserLoggedIn = () => {
    const access_token = getData(keys.accessToken);
    if (typeof access_token !== 'undefined') {
        const userDetails = getUserDetails(access_token);
        if (typeof userDetails !== 'undefined' && typeof userDetails?.userId !== 'undefined') {
            return true;
        }
    }
    return false;
}