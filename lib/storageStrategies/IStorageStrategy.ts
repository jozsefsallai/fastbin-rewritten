interface ICreateParams {
  key: string;
  contents: string;
}

export default interface IStorageStrategy {
  create(params: ICreateParams);
  get(key: string): Promise<string>;
  getStream(key: string);
  exists(key: string): Promise<boolean>;
}
