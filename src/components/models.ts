export interface Condition {
  values: Value[];
  groups: Group[];
  logicalOperator: LogicalOperator;
}

export interface Query {
  conditions: Condition[];
}

export interface Value {
  contains: Contain;
  input: string[];
  logicalOperator: LogicalOperator;
}

export interface Group {
  values: Value[];
  logicalOperator: LogicalOperator;
  depth: number;
}

export enum Contain {
  'ANY',
  'ALL',
}

export enum LogicalOperator {
  'OR',
  'AND',
}
