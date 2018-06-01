declare module "checkobj" {
    type checkT<T> = T;
    type Plaint<T> = {
        [u in keyof T]: "string" | "number" | "boolean" | "array" | "object" | "function" | Plaint<T[u]>
        }
    export function transFunc<T>(params: any, transer: T): { stat: boolean, val: T }
    export function checkObj<T>(rule: Plaint<T>, o: T);
}
