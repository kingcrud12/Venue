"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const exception_handler_1 = require("./exception.handler");
const core_2 = require("@nestjs/core");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalFilters(new exception_handler_1.AllExceptionsFilter(app.get(core_2.HttpAdapterHost)));
    await app.listen(process.env.PORT ?? 3030);
}
bootstrap();
//# sourceMappingURL=main.js.map