"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwaggerTransformer = void 0;
const lodash_1 = require("lodash");
class SwaggerTransformer {
    normalizePaths(denormalizedDoc) {
        const roots = lodash_1.filter(denormalizedDoc, (r) => r.root);
        const groupedByPath = lodash_1.groupBy(roots, ({ root }) => root.path);
        const paths = lodash_1.mapValues(groupedByPath, (routes) => {
            const keyByMethod = lodash_1.keyBy(routes, ({ root }) => root.method);
            return lodash_1.mapValues(keyByMethod, (route) => {
                return Object.assign(Object.assign({}, lodash_1.omit(route.root, ['method', 'path'])), lodash_1.omit(route, 'root'));
            });
        });
        return {
            paths
        };
    }
    unescapeColonsInPath(app, moduleRoutes) {
        const httpAdapter = app.getHttpAdapter();
        const usingFastify = httpAdapter && httpAdapter.getType() === 'fastify';
        const unescapeColon = usingFastify
            ? (path) => path.replace(/:\{([^}]+)\}/g, ':$1')
            : (path) => path.replace(/\[:\]/g, ':');
        return moduleRoutes.map((moduleRoute) => (Object.assign(Object.assign({}, moduleRoute), { root: Object.assign(Object.assign({}, moduleRoute.root), { path: unescapeColon(moduleRoute.root.path) }) })));
    }
}
exports.SwaggerTransformer = SwaggerTransformer;
