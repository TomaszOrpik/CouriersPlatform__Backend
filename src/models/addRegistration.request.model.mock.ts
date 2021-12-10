import { createMockNumber, createMockString } from "../mocks/utilities"
import { AddRegistrationRequestModel, IAddRegistrationRequestModel } from "./addRegistration.request.model"

export const createMockAddRegistrationRequestModel = (props?: IAddRegistrationRequestModel): AddRegistrationRequestModel => {
    return {
        id: createMockString(),
        packageId: createMockString(),
        date: createMockString(),
        user: createMockString(),
        subject: createMockString(),
        additionaInfo: createMockString(),
        contactPhone: createMockNumber(),
        contactMail: createMockString(),
        status: createMockString(),
    }
}