export interface DocumentExistsInterface {
  exists(documentid: string): Promise<boolean>;
}
