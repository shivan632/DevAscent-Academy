"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const cookieParser = require("cookie-parser");
const helmet_1 = require("helmet");
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const transform_interceptor_1 = require("./common/interceptors/transform.interceptor");
async function bootstrap() {
    const logger = new common_1.Logger('Bootstrap');
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use((0, helmet_1.default)({
        crossOriginResourcePolicy: { policy: 'cross-origin' },
    }));
    app.use(cookieParser());
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    app.enableCors({
        origin: (origin, callback) => {
            if (!origin)
                return callback(null, true);
            const allowedOrigins = [
                frontendUrl,
                'http://localhost:3000',
                'http://127.0.0.1:3000',
                'https://dev-ascent-academy.vercel.app',
            ];
            if (allowedOrigins.includes(origin) ||
                origin.endsWith('.vercel.app')) {
                return callback(null, true);
            }
            callback(new Error(`Origin ${origin} not allowed by CORS`));
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'x-razorpay-signature'],
    });
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: { enableImplicitConversion: true },
    }));
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    app.useGlobalInterceptors(new transform_interceptor_1.TransformInterceptor());
    const httpAdapter = app.getHttpAdapter();
    httpAdapter.get('/api/v1/health', (req, res) => {
        res.json({
            success: true,
            data: {
                status: 'ok',
                db: 'connected',
                timestamp: new Date().toISOString(),
            },
        });
    });
    const port = parseInt(process.env.PORT || '3001', 10);
    await app.listen(port, '0.0.0.0');
    logger.log(`🚀 DevAscent Backend API is running on port ${port}/api/v1`);
}
bootstrap();
//# sourceMappingURL=main.js.map