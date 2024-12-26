const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

const isValidBarcode = (barcode) => {
    const barcodeString = barcode.toString().trim();

    if (barcodeString.length !== 13) {
        return false;
    }

    let sum = 0;
    for (let i = 0; i < 12; i++) {
        const digit = parseInt(barcodeString[i], 10);
        if (isNaN(digit)) {
            return false;
        }
        sum += i % 2 === 0 ? digit : digit * 3;
    }

    const checksum = (10 - (sum % 10)) % 10;
    const lastDigit = parseInt(barcodeString[12], 10);
    
    if (checksum !== lastDigit) {
        console.log(`Checksum inválido: esperado ${checksum}, mas encontrou ${lastDigit}`);
        return false;
    }

    return true;
};

module.exports = { isValidEmail, isValidBarcode };