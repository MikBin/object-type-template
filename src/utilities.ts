
export const rgNumber = new RegExp(/^[0-9.,]*$/);
export const rgLettersOnly = new RegExp(/'[A-ZÀ-ÚÄ-Ü\s]+'/);
export const rgSpecialChars = new RegExp(/[^.,a-zA-Z0-9 \n\.]/);//excluded comma and dots

export const matchNumber = (num:string):boolean => {
    return rgNumber.test(num);
}

