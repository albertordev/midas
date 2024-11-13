export enum AccountColumns {
  CODE,
  DESCRIPTION,
  ICON,
  TYPE,
  ACTIONS,
  EDIT,
  DELETE,
}

export enum MovementColumns {
  ACCOUNT,
  DESCRIPTION,
  TYPE,
  DATE,
  AMOUNT,
  ACTIONS,
  EDIT,
  DELETE,
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
