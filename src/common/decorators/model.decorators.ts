import 'reflect-metadata';
import { Schema, SchemaDefinition } from 'mongoose';

const SCHEMA_METADATA_KEY = Symbol('schema-properties');
const SCHEMA_OPTIONS_KEY = Symbol('schema-options');

export interface SchemaPropertyOptions {
  type: unknown;
  required?: boolean | [boolean, string];
  unique?: boolean;
  default?: unknown;
  trim?: boolean;
  index?: boolean | string;
  [key: string]: unknown;
}

export function SchemaProperty(options: SchemaPropertyOptions) {
  return function (target: object, propertyKey: string) {
    const existingProperties =
      Reflect.getMetadata(SCHEMA_METADATA_KEY, target) || {};

    existingProperties[propertyKey] = options;

    Reflect.defineMetadata(SCHEMA_METADATA_KEY, existingProperties, target);
  };
}

export function Timestamps() {
  return function (constructor: new (...args: unknown[]) => unknown) {
    const existingOptions =
      Reflect.getMetadata(SCHEMA_OPTIONS_KEY, constructor) || {};

    Reflect.defineMetadata(
      SCHEMA_OPTIONS_KEY,
      { ...existingOptions, timestamps: true, versionKey: false },
      constructor
    );
  };
}

export function Index(
  fields: Record<string, 1 | -1 | string>,
  options?: Record<string, unknown>
) {
  return function (constructor: new (...args: unknown[]) => unknown) {
    const existingOptions =
      Reflect.getMetadata(SCHEMA_OPTIONS_KEY, constructor) || {};

    const indexes = existingOptions.indexes || [];
    indexes.push([fields, options || {}]);

    Reflect.defineMetadata(
      SCHEMA_OPTIONS_KEY,
      { ...existingOptions, indexes },
      constructor
    );
  };
}

export function SchemaOptions(options: Record<string, unknown>) {
  return function (constructor: new (...args: unknown[]) => unknown) {
    const existingOptions =
      Reflect.getMetadata(SCHEMA_OPTIONS_KEY, constructor) || {};

    Reflect.defineMetadata(
      SCHEMA_OPTIONS_KEY,
      { ...existingOptions, ...options },
      constructor
    );
  };
}

export function generateSchema(target: unknown): Schema {
  if (typeof target !== 'function') {
    throw new Error('Target must be a class constructor');
  }
  const prototype = target.prototype;
  const properties = Reflect.getMetadata(SCHEMA_METADATA_KEY, prototype) || {};
  const options = Reflect.getMetadata(SCHEMA_OPTIONS_KEY, target) || {};

  return new Schema(properties as SchemaDefinition, options);
}
