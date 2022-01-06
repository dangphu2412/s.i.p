import { AccessRights } from '@constants/access-rights.enum';
import {
  RuleConfigFactory,
  RuleDefinition,
} from '@external/racl/core/rule.config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RuleConfig implements RuleConfigFactory {
  defineRules(): RuleDefinition {
    return {
      [AccessRights.RootAccess.ADMIN]: { matchCondition: true },
      [AccessRights.RootAccess.EDIT_OWN]: {
        matchCondition: (params: { authorId: string; ownerId: string }) => {
          return params.authorId === params.ownerId;
        },
        description: 'Apply to all editable data',
      },
      [AccessRights.RootAccess.READ_ONLY]: {
        matchCondition: true,
        description: 'Apply to all readable data',
      },
      [AccessRights.RootAccess.WRITE_ONLY]: {
        matchCondition: true,
        description: 'Apply to all writable data',
      },
      [AccessRights.Business.CREATE_POST]: {
        matchCondition: true,
        description:
          'User needs to finish all required tasks then they can create new post',
      },
    };
  }
}
