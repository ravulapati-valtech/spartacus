import {
  AUTH_SERVICE,
  NGRX_STORE,
  SPARTACUS_CORE,
  STORE,
  USER_CONSENT_SERVICE,
} from '../../../../shared/constants';
import { ConstructorDeprecation } from '../../../../shared/utils/file-utils';

export const USER_CONSENT_SERVICE_MIGRATION: ConstructorDeprecation = {
  // projects/core/src/user/facade/user-consent.service.ts
  class: USER_CONSENT_SERVICE,
  importPath: SPARTACUS_CORE,
  deprecatedParams: [
    {
      className: STORE,
      importPath: NGRX_STORE,
    },
  ],
  addParams: [
    {
      className: AUTH_SERVICE,
      importPath: SPARTACUS_CORE,
    },
  ],
};
