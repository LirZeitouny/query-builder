import { ContainTypes } from '../pages/queryModel';

const defaultContainType = ContainTypes.ANY;

export function queryBuilder(condition) {
  let res = 'SELECT * ';
  res += `FROM ${condition.tableName} `;
  res += 'WHERE ';

  condition.groups.forEach((group, gIndex) => {
    res += ' (';
    group.values.forEach((value, vIndex) => {
      res += '(';
      value.input.forEach((input, iIndex) => {
        let containsOperator =
          value.contains === defaultContainType ? 'OR ' : 'AND ';
        if (iIndex == value.input.length - 1) containsOperator = '';

        res += `${condition.column} LIKE '%${input}%' ${containsOperator}`;
      });

      res += ')';

      const valuesLogicalOperator =
        vIndex === group.values.length - 1 ? '' : value.logicalOperator;
      res += valuesLogicalOperator;
    });
    res += ') ';

    let groupsLogicalOperator =
      gIndex === condition.groups.length - 1 ? '' : group.logicalOperator;
    res += groupsLogicalOperator;
  });

  return res.replace(/\s+/g, ' '); //removing duplicate spaces
}
