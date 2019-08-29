export * from "./transformer";
export declare function schemaOf<T extends {}>(): string;
export declare function factoryOf<T extends {}>(): Promise<() => T>;
export declare function validatorOf<T extends {}>(): Promise<
  (obj: unknown) => obj is T
>;
