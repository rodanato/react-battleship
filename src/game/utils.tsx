export const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

export const getUniqueID = (plus: number = 0) => new Date().getTime() + plus;
