import { createMockNumber, createMockPosition, createMockString } from "../mocks/utilities";
import { createMockRegion } from "../models/region.model.mock";
import { Admin } from "./admin.schema";
import { Courier } from "./courier.schema";
import { Package } from "./package.schema";
import { Registration } from "./registration.schema";
import { User } from "./user.schema";

describe('Schema constructors', () => {

    test('should create admin schema', () => {
        const login = createMockString();
        const password = createMockString();
        const write = true;
        const read = true;

        const result = new Admin({
            login,
            password,
            write,
            read
        });

        expect(result).toEqual({
            login,
            password,
            write,
            read
        });
    });

    test('should create courier schema', () => {
        const employeeNumber = createMockString();
        const firstName = createMockString();
        const lastName = createMockString();
        const password = createMockString();
        const phoneNumber = createMockNumber();
        const startPosition = createMockPosition();
        const vehicle = createMockString();
        const registration = createMockString();
        const startTime = createMockString();
        const region = createMockRegion();
        const deliveredPackages = [createMockString()];
        const undeliveredPackages = [createMockString()];
        const currentPackages = createMockString();

        const result = new Courier({
            employeeNumber,
            firstName,
            lastName,
            password,
            phoneNumber,
            startPosition,
            vehicle,
            registration,
            startTime,
            region,
            deliveredPackages,
            undeliveredPackages,
            currentPackages
        });

        expect(result).toEqual({
            employeeNumber,
            firstName,
            lastName,
            password,
            phoneNumber,
            startPosition,
            vehicle,
            registration,
            startTime,
            region,
            deliveredPackages,
            undeliveredPackages,
            currentPackages
        });
    });

    test('should create package schema', () => {
        const packageNumber = createMockString();
        const sendDate = createMockString();
        const receiver = createMockString();
        const sender = createMockString();
        const position = createMockPosition();
        const comments = createMockString();
        const status = createMockString();

        const result = new Package({
            packageNumber,
            sendDate,
            receiver,
            sender,
            position,
            comments,
            status
        });

        expect(result).toEqual({
            packageNumber,
            sendDate,
            receiver,
            sender,
            position,
            comments,
            status
        });
    });

    test('should create registration schema', () => {
        const packageId = createMockString();
        const date = createMockString();
        const user = createMockString();
        const subject = createMockString();
        const additionalInfo = createMockString();
        const contactPhone = createMockNumber();
        const contactMail = createMockString();
        const status = createMockString();

        const result = new Registration({
            packageId,
            date,
            user,
            subject,
            additionalInfo,
            contactPhone,
            contactMail,
            status
        });

        expect(result).toEqual({
            packageId,
            date,
            user,
            subject,
            additionalInfo,
            contactPhone,
            contactMail,
            status
        });
    });

    test('should create user schema', () => {
        const phoneNumber = createMockNumber();
        const password = createMockString();
        const firstName = createMockString();
        const lastName = createMockString();
        const street = createMockString();
        const postCode = createMockString();
        const city = createMockString();

        const result = new User({
            phoneNumber,
            password,
            firstName,
            lastName,
            street,
            postCode,
            city
        });

        expect(result).toEqual({
            phoneNumber,
            password,
            firstName,
            lastName,
            street,
            postCode,
            city
        });
    });
});