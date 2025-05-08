"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
function hashPassword(args) {
    return __awaiter(this, void 0, void 0, function* () {
        if (args.data.password) {
            args.data.password = yield bcrypt_1.default.hash(args.data.password, 10);
        }
    });
}
exports.default = client_1.Prisma.defineExtension({
    name: 'password-hashing-create-or-update',
    query: {
        user: {
            create(_a) {
                return __awaiter(this, arguments, void 0, function* ({ args, query }) {
                    yield hashPassword(args);
                    return query(args);
                });
            },
            update(_a) {
                return __awaiter(this, arguments, void 0, function* ({ args, query }) {
                    yield hashPassword(args);
                    return query(args);
                });
            }
        }
    }
});
