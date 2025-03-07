"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const fs_1 = require("fs");
const path_1 = require("path");
const dirPath = process.env.DATABASE_FILE_DIRECTORY || "";
let UploadService = class UploadService {
    async saveFile(file, name) {
        const namePath = path_1.default.resolve(name);
        const filePath = path_1.default.join(dirPath, `file_${Date.now()}`);
        (0, fs_1.writeFile)('file', file.buffer, (err) => {
            if (err) {
                console.log('Error creating file : ', err);
                return;
            }
            console.log(`File "${filePath}" has been created.`);
        });
        return `File saved to ${filePath}`;
    }
};
exports.UploadService = UploadService;
exports.UploadService = UploadService = __decorate([
    (0, common_1.Injectable)()
], UploadService);
//# sourceMappingURL=upload.service.js.map