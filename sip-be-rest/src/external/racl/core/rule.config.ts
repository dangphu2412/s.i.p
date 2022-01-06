export type AuthorizeHandler = (params: Record<string, unknown>) => boolean;

export interface RuleDefinition {
  [ruleKey: string]: {
    matchCondition: AuthorizeHandler | boolean;
    description?: string;
  };
}

export interface RuleConfigFactory {
  defineRules(): RuleDefinition;
}
