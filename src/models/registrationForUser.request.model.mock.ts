import { createMockNumber, createMockString } from "../mocks/utilities"
import { IRegistrationForUserRequestModel, RegistrationForUserRequestModel } from "./registrationForUser.request.model"
import { RegistrationStatus } from "./registrationStatus.enum"

export const createMockRegistrationForUser = (props?: IRegistrationForUserRequestModel): RegistrationForUserRequestModel => {
    return {
        id: createMockString(),
        packageId: createMockString(),
        date: new Date().toString(),
        user: createMockString(),
        subject: createMockString(),
        additionalInfo: createMockString(),
        contactPhone: createMockNumber(),
        contactMail: createMockString(),
        status: RegistrationStatus.waiting,
        ...props
    }
}