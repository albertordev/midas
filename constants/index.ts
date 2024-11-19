export enum AccountColumns {
  CODE,
  DESCRIPTION,
  ICON,
  TYPE,
}

export enum MovementColumns {
  ACCOUNT,
  DESCRIPTION,
  TYPE,
  DATE,
  AMOUNT,
}

export enum BalanceColumns {
  ACCOUNT,
  NAME,
  TYPE,
  PERIOD,
  YEAR,
  AMOUNT,
}

export enum BudgetColumns {
  ACCOUNT,
  NAME,
  TYPE,
  PERIOD,
  YEAR,
  AMOUNT,
}

export enum FormFieldType {
  INPUT = 'input',
  TEXTAREA = 'textarea',
  CHECKBOX = 'checkbox',
  DATE_PICKER = 'datePicker',
  SELECT = 'select',
  SKELETON = 'skeleton',
}

export enum RowActions {
  HEADER,
  DELETE,
  EDIT,
}
