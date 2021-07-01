import * as lunatic from '@inseefr/lunatic';
export * from './dataDownload';

export const getNotNullCollectedState = questionnaire =>
  lunatic.getCollectedStateByValueType(questionnaire)('COLLECTED', false);

export const secureCopy = objectToCopy =>
  JSON.parse(JSON.stringify(objectToCopy));
