import 'reflect-metadata';
import { Application, Request, Response, NextFunction } from 'express';

const ROUTES_KEY = Symbol('routes');
const PREFIX_KEY = Symbol('prefix');

type HttpMethod = 'get' | 'post' | 'put' | 'delete';

type Middleware = (req: Request, res: Response, next: NextFunction) => void;

interface RouteDefinition {
  method: HttpMethod;
  path: string;
  handlerName: string;
  middlewares?: Middleware[];
}

export function Controller(prefix = ''): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(PREFIX_KEY, prefix, target);
    if (!Reflect.hasMetadata(ROUTES_KEY, target)) {
      Reflect.defineMetadata(ROUTES_KEY, [], target);
    }
  };
}

function createRouteDecorator(method: HttpMethod) {
  return (path: string, ...middlewares: Middleware[]) =>
    (target: object, propertyKey: string | symbol) => {
      const ctor = (target as { constructor: object }).constructor;
      const routes: RouteDefinition[] =
        Reflect.getMetadata(ROUTES_KEY, ctor) || [];
      routes.push({
        method,
        path,
        handlerName: propertyKey as string,
        middlewares,
      });
      Reflect.defineMetadata(ROUTES_KEY, routes, ctor);
    };
}

export const Get = createRouteDecorator('get');
export const Post = createRouteDecorator('post');
export const Put = createRouteDecorator('put');
export const Delete = createRouteDecorator('delete');

export function registerControllers(
  app: Application,
  controllers: Array<new () => object>
) {
  controllers.forEach((ControllerClass) => {
    const instance = new ControllerClass();
    const prefix = Reflect.getMetadata(PREFIX_KEY, ControllerClass) || '';
    const routes: RouteDefinition[] =
      Reflect.getMetadata(ROUTES_KEY, ControllerClass) || [];
    routes.forEach((route) => {
      const handlerCandidate = (instance as Record<string, unknown>)[
        route.handlerName
      ];
      if (typeof handlerCandidate !== 'function') {
        throw new TypeError(
          `Handler for ${route.handlerName} is not a function`
        );
      }
      const handler = handlerCandidate.bind(instance);
      const fullPath = prefix + route.path;
      if (route.middlewares && route.middlewares.length > 0) {
        app[route.method](fullPath, ...route.middlewares, handler);
      } else {
        app[route.method](fullPath, handler);
      }
    });
  });
}
