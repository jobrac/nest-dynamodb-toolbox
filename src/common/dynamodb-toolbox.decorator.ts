import { Inject } from '@nestjs/common';
import { getEntityToken, getTableToken } from './dynamodb-toolbox.utils';

export const InjectEntity = (model: string) => Inject(getEntityToken(model));
export const InjectTable = () => Inject(getTableToken());