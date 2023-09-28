export interface Condition {
  groups: Group;
  logicalOperator: LogicalOperatorTypes;
  depth: number;
}

export interface Query {
  conditions: Condition[];
}

export interface Value {
  contains: Contain;
  input: string[];
  logicalOperator: LogicalOperatorTypes;
}

export interface Group {
  values: Value[];
  logicalOperator: LogicalOperatorTypes;
  group: Group;
}

export enum Contain {
  ANY = 'ANY',
  ALL = 'ALL',
}

export enum LogicalOperatorTypes {
  OR = 'OR',
  AND = 'AND',
}
