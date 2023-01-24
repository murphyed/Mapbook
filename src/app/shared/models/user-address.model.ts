export class UserAddress {
  constructor(
    public street: string,
    public street2: string,
    public city: string,
    public state: string,
    public country: string,
    public zipCode: string,
    public lat: number,
    public lng: number,
    public monthNumber: number,
    public month: string,
    public year: number,
    public age: number
  ) {}
}
