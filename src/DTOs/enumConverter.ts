export class EnumConverter {
    static getByValue(enumName: any, value: string): string {
        return Object.keys(enumName).find(name => enumName[name] === value);
    }
}