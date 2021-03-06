
export type Primitive = number | string | boolean;


//#1
export type JSONPrimitive = string | number | boolean | null;
export type JSONValue = JSONPrimitive | JSONObject | JSONArray;
export type JSONObject = { [member: string]: JSONValue };
export type JSONArray = JSONValue[];

//#2
type JsonPrimitive = string | number | boolean | null
interface JsonMap extends Record<string, JsonPrimitive | JsonArray | JsonMap> { }
interface JsonArray extends Array<JsonPrimitive | JsonArray | JsonMap> { }
type _Json = JsonPrimitive | JsonMap | JsonArray


//#3
type Json =
    | null
    | boolean
    | number
    | string
    | Json[]
    | { [prop: string]: Json };

type JsonCompatible<T> = {
    [P in keyof T]: T[P] extends Json
    ? T[P]
    : Pick<T, P> extends Required<Pick<T, P>>
    ? never
    : T[P] extends (() => any) | undefined
    ? never
    : JsonCompatible<T[P]>;
};

//#4
export type SerializableScalar = string | number | boolean | null;

export type SerializableObject = {
    [key: string]: SerializableScalar | SerializableObject | SerializableArray;
}

export type SerializableArray = Array<SerializableScalar | SerializableObject | SerializableArray>;

export type Serializable = SerializableScalar | SerializableObject | SerializableArray;


//#5
export type primitive = null
    | boolean
    | number
    | string

type DefinitelyNotJsonable = ((...args: any[]) => any) | undefined

export type IsJsonable<T> =
    // Check if there are any non-jsonable types represented in the union
    // Note: use of tuples in this first condition side-steps distributive conditional types
    // (see https://github.com/microsoft/TypeScript/issues/29368#issuecomment-453529532)
    [Extract<T, DefinitelyNotJsonable>] extends [never]
    // Non-jsonable type union was found empty
    ? T extends primitive
    // Primitive is acceptable
    ? T
    // Otherwise check if array
    : T extends (infer U)[]
    // Arrays are special; just check array element type
    ? IsJsonable<U>[]
    // Otherwise check if object
    : T extends object
    // It's an object
    ? {
        // Iterate over keys in object case
        [P in keyof T]:
        // Recursive call for children
        IsJsonable<T[P]>
    }
    // Otherwise any other non-object no bueno
    : never
    // Otherwise non-jsonable type union was found not empty
    : never;


export type MapOfObjectTemplate = { [prop: string]: ObjectTemplate };

/**@TODO add objectMap to represent a map of similar templates? 
 * or just usa flag in that case object is going to be an objectTemplate or a map with single value "objectMap":
*/
export interface ValueTemplate {
    primitive: Array<string> | null;
    object: MapOfObjectTemplate | null;
    array: ObjectTemplate | null;
    isObjectMap?: boolean;
}

/**@TODO sometimes an array could have some index with special structure ex an header at index 0
 * so when types has only array but value contains object too the indexes are for special cases of the array
 */
export interface ObjectTemplate {
    types: string[];
    value: ValueTemplate;
    optional: boolean;
    isLeaf?: boolean;
    depth?: number;
    name?: string;
}

export type PropsType = 'number' | 'string' | 'date';

export const OBJECT_MAP_PROP = "__ObjectMap";

export interface IPropsStats {
    averageLength: number;
    integers: number;
    decimals: number;
    numbers: number;
    strings: number;
    letters:number;
    lettersAndNumbers:number;
    dates: number;
}; 