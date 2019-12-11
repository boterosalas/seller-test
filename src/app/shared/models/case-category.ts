/**
 * Estructura para la información del usuario
 */
export class CaseCategory {
  idMatrix: string;
  classification: string;
  category: string;
  subcategory: string;
  type: Array<string>;
  active: boolean;
  fields: Array<FieldsRequired>;
}

export class FieldsRequired {
  name: string;
  requiered: boolean;
  placeHolder: string;
}
