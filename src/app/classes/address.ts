export class Address {
    addressLine1: string;
    addressLine2: string;
    postalCode: string;
    city: string;
    country: string;

    constructor({addressLine1, addressLine2, postalCode, city, country}) {
        this.addressLine1 = addressLine1;
        this.addressLine2 = addressLine2;
        this.postalCode = postalCode;
        this.city = city;
        this.country = country;
    }
}
