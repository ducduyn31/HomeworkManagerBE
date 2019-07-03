import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class StripRequestContextPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value.context) {
      delete value.context;
    }
    return value;
  }
}
