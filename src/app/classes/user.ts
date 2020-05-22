import { Address } from './address';

export class User {
    firstname: string;
    lastname: string;
    photoUrl: string;

    constructor({firstname, lastname, photoUrl}) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.photoUrl = photoUrl;
    }
}
