import Line from "../line";

export interface Transformer {
  transformComment(comment: string): string;
  transformKeyValue(key: string, value: string): string;
  /* merge newValues dans input selon la convention de la plateforme (utilisation d'un commentaire pour séparer ce qui est généré */
  insert(
    input: string,
    newValues: string,
    options?: { [key: string]: any }
  ): Promise<string>;
  transformPluralsValues?(key: string, values: Line[]): string;
  AUTOGENERATED_TAG?: string;
  getFileName: (item: string) => string;
}
