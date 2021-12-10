import { createMockDateString, createMockNumber, createMockRegistrationStatus, createMockString } from "../mocks/utilities"
import { IRegistration } from "./registration.schema"

export const createMockRegistration = (props?: IRegistration) => {
    return {
        packageId: createMockString(),
        date: createMockDateString(),
        user: createMockString(),
        subject: createMockString(),
        additionalInfo: createMockString(),
        contactPhone: createMockNumber(),
        contactMail: createMockString(),
        status: createMockRegistrationStatus(),
        ...props
    }
}