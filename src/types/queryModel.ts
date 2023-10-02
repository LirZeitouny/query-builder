// queryModel.ts
export interface Condition {
  groups: Group[];
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

export interface QueryResultItem {
  ID: number;
  Name: string;
  City: string;
  Position: string;
  Experience: number;
  Department: string;
  Salary: number;
}

// queryModel.ts
export interface Group {
  values: Value[];
  logicalOperator: LogicalOperatorTypes;
  group?: Group; // Make 'group' property optional with '?'
}

export enum ContainTypes {
  ANY = 'ANY',
  ALL = 'ALL',
}

export enum LogicalOperatorTypes {
  OR = 'OR',
  AND = 'AND',
}
