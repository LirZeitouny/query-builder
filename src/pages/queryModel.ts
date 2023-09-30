export interface Condition {
  groups: Group;
  logicalOperator: LogicalOperatorTypes;
  depth: number;
  columns: string;
  tableName: string;
}

export interface Value {
  contains: ContainTypes;
  input: string[];
  logicalOperator: LogicalOperatorTypes;
}

export interface Group {
  values: Value[];
  logicalOperator: LogicalOperatorTypes;
  group: Group;
}

export enum ContainTypes {
  ANY = 'ANY',
  ALL = 'ALL',
}

export enum LogicalOperatorTypes {
  OR = 'OR',
  AND = 'AND',
}
