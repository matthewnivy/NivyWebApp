export const saveData = (key, value) => {
	localStorage.setItem(key, value);
	console.log(key)
};

export const getData = (key) => {
	return localStorage.getItem(key);
};
