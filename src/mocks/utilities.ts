import { RegistrationStatus } from "../models/registrationStatus.enum";
import { PackageStatus } from "../models/packageStatus.enum";
import { Position } from '../models/position.model';

export const createMockString = () => (Math.random() + 1).toString(36).substring(7);
export const createMockNumber = () => Math.floor(Math.random() * 10000000);
export const createMockDateString = () => new Date('2021-12-01T12:00:00').toString();
export const createMockPackageStatus = () => PackageStatus.failed;
export const createMockRegistrationStatus = () => RegistrationStatus.waiting;
export const createMockPosition = (): Position => {
    return {
        latitude: createMockNumber(),
        longitude: createMockNumber()
    }
}