import { Inject } from '@nestjs/common';
import { getEntityToken } from './dynamodb.utils';

export const InjectEntity = (model: string) => Inject(getEntityToken(model));