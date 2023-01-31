import { randomBytes } from 'crypto'

export function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function compareDate(first_date: string, second_date: string) {
    let convertFirstDate = first_date.split("-")
    let convertSecondDate = second_date.split("-")
    let newFirstDate = convertFirstDate[1] + '-' + convertFirstDate[0] + '-' + convertFirstDate[2]
    let newSecondDate = convertSecondDate[1] + '-' + convertSecondDate[0] + '-' + convertSecondDate[2]
    let date_filter = new Date(String(newFirstDate));
    let date_value = new Date(String(newSecondDate));
    if (date_filter <= date_value) {
        return true;
    };
    return false;
}

export function random() {
    let randomValue = randomBytes(10).toString('hex');
    return randomValue
}

export function randomNumber() {
    let min = Math.ceil(100000000000);
    let max = Math.floor(199999999999);
    let mobileNumber = Math.floor(Math.random() * (Math.max(max) - Math.ceil(min)) + min);
    return mobileNumber.toString();
}
