import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaginatedResponseDto } from '../dto/paginated-response.dto.js';

type Response<T> = { data: T };

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
    T,
    T | Response<T>
> {
    intercept(
        _context: ExecutionContext,
        next: CallHandler<T>,
    ): Observable<T | Response<T>> {
        return next.handle().pipe(
            map((value) => {
                if (value instanceof PaginatedResponseDto) return value;
                return { data: value };
            }),
        );
    }
}
