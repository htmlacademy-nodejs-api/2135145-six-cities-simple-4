import { ClassConstructor, plainToInstance } from 'class-transformer';
import { ValidationError } from 'class-validator';
import * as crypto from 'node:crypto';
import * as jose from 'jose';
import { DEFAULT_STATIC_IMAGES } from '../../app/rest.constant.js';
import { AuthPayload } from '../../types/auth-payload.type.js';
import { ServiceError } from '../../types/service-error.enum.js';
import { UnknownRecord } from '../../types/unknown-record.js';
import { ValidationErrorField } from '../../types/validation-error-field.type.js';

export const createSHA256 = (line: string, salt: string) => {
  const shaHasher = crypto.createHmac('sha256', salt);
  return shaHasher.update(line).digest('hex');
};

export function fillDto<T, V>(someDto: ClassConstructor<T>, plainObject: V) {
  return plainToInstance(someDto, plainObject, {excludeExtraneousValues: true});
}

export function createErrorObject(errorType: ServiceError, message: string, details: ValidationErrorField[] = []) {
  return {
    errorType,
    error: message,
    details,
  };
}

export async function createJWT(algorithm: string, jwtSecret: string, payload: AuthPayload): Promise<string> {
  return new jose.SignJWT({ ...payload })
    .setProtectedHeader({alg: algorithm})
    .setIssuedAt()
    .setExpirationTime('2d')
    .sign(crypto.createSecretKey(jwtSecret, 'utf-8'));
}

export function transformErrors(errors: ValidationError[]): ValidationErrorField[] {
  return errors.map(({property, value, constraints}) => ({
    property,
    value,
    messages: constraints ? Object.values(constraints) : [],
  }));
}

export function getFullServerPath(host: string, port: number) {
  return `http://${host}:${port}`;
}

function isObject(value: unknown) {
  return typeof value === 'object' && value !== null;
}

export function transformProperty(
  property: string,
  someObject: UnknownRecord,
  transformFn: (object: UnknownRecord) => void,
) {
  return Object.keys(someObject).forEach((key) => {
    if(key === property) {
      transformFn(someObject);
    } else if(isObject(someObject[key])) {
      transformProperty(property, someObject[key] as UnknownRecord, transformFn);
    }
  });
}

export function transformObject(
  properties: string[],
  staticPath: string,
  uploadPath: string,
  data: UnknownRecord,
) {
  return properties.forEach((property) => {
    transformProperty(property, data, (target: UnknownRecord) => {
      const rootPath = DEFAULT_STATIC_IMAGES.includes(target[property] as string) ? staticPath : uploadPath;
      target[property] = `${rootPath}/${target[property]}`;
    });
  });

}
