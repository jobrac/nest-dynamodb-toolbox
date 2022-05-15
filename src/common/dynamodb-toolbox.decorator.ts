import { Inject } from '@nestjs/common';
import { getEntityToken } from './dynamodb-toolbox.utils';

export const InjectEntity = (model: string) => Inject(getEntityToken(model));