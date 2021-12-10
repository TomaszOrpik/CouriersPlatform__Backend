export interface ITokenData {
    login: string;
    role: string;
}

export class TokenData implements ITokenData {
    login: string;
    role: string;

    constructor(props?: ITokenData) {
        if (props) {
            this.login = props.login;
            this.role = props.role;
        }
    }
}