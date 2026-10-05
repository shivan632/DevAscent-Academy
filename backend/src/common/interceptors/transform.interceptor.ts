import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  success: boolean;
  data: T;
  meta?: any;
  stats?: any;
  [key: string]: any;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map((res) => {
        // If the handler already returned { success, data } or is a custom structure
        if (res && typeof res === 'object' && 'success' in res && 'data' in res) {
          return res;
        }

        // If response includes data and additional properties (e.g. meta, stats)
        if (res && typeof res === 'object' && 'data' in res && !Array.isArray(res)) {
          return {
            success: true,
            ...res,
          };
        }

        return {
          success: true,
          data: res,
        };
      }),
    );
  }
}
