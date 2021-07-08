
import jwt_decode, { JwtPayload } from 'jwt-decode'

export class User {
  private _tokenExpirationDate: Date;
  private decoded: JwtPayload;

  // constructor enable the new keyword to create an object
  constructor(
    public username: string,
    /* _ and private: I don't want to access the token from outside, if I need the
    Token, I will call a method that will also check the validity before returning
    a token string */
    private _token: string
  ) {
    // determining expiration time from token
    // https://github.com/auth0/jwt-decode/issues/82#issuecomment-782941154
    this.decoded = jwt_decode<JwtPayload>(_token);
    this._tokenExpirationDate = new Date(Number(this.decoded.exp) * 1000);
  }

  // getter: is like a function but is accessed as a property (ex user.token)
  // code will be executed when accessing this property. Assign a value to
  // token will throw and error: we need a setter method to set this property
  get token() {
    // if i don't have an expiration date or this is less that current time (new Date())
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
      // the token is expired, return null even if I have a token
      return null
    }

    // return value of a private string
    return this._token;
  }

  get expiresIn() {
    const now = new Date().getTime();
    const expiresIn = this._tokenExpirationDate.getTime() - now;

    if (expiresIn < 0) {
      return 0;
    } else {
      return expiresIn;
    }
  }
}
