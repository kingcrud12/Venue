"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const bootstrap = async () => {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const options = new swagger_1.DocumentBuilder()
        .setTitle('Konekt web and mobile api')
        .setDescription('API for konekt web and mobile api')
        .setVersion('1.0.0')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, options);
    swagger_1.SwaggerModule.setup('/', app, document);
    app.enableCors();
    await app.listen(PORT);
};
bootstrap()
    .then(() => console.log(`Server is running: http://localhost:${PORT}`))
    .catch((err) => console.error(err));
//# sourceMappingURL=main.js.map