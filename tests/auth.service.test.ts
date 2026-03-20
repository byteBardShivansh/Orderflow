import { describe, expect, it } from "@jest/globals";
import { signJwt, verifyJwt } from "../auth-service/auth.service";
import { Role } from "../shared/enums";
import { v4 as uuid } from "uuid";
import { generateToken } from "../auth-service/token";
import { verifyToken } from "../auth-service/token";
import { User } from "../shared/types";

describe("Auth Service", () => {
    it("should generate and verify a JWT", () => {
        const userId = uuid();
        const role = Role.ADMIN;
        const token = generateToken({ id: userId, role });
        const decoded = verifyToken(token);
        expect(decoded.id).toBe(userId);
        expect(decoded.role).toBe(role);
    });
});
export default describe;
export { expect, it };
