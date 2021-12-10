import { createMockString, createMockDateString, createMockPosition } from "../mocks/utilities";
import { PackageStatus } from "../models/packageStatus.enum";
import { createMockPackageDtoPublic } from "./package.dto.public.mock";
import { createMockUserDTOPublic } from "./user.dto.public.mock";

describe('PackageDtoPublicMock', () => {
    it('should create mock', () => {
        const id = createMockString();
        const packageNumber = createMockString();
        const sendDate = new Date(createMockDateString());
        const receiver = createMockUserDTOPublic();
        const sender = createMockUserDTOPublic();
        const position = createMockPosition();
        const comments = createMockString();
        const status = PackageStatus.failed;

        const result = createMockPackageDtoPublic({
            id,
            packageNumber,
            sendDate,
            receiver,
            sender,
            position,
            comments,
            status
        });

        expect(result).toEqual({
            id,
            packageNumber,
            sendDate,
            receiver,
            sender,
            position,
            comments,
            status
        });
    });
});