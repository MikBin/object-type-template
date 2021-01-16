import { ObjectTemplate, ValueTemplate, MapOfObjectTemplate, Primitive } from './interfaces';

export const removeNonPrimitive = (types: string[]) => types.filter(type => type !== "array" && type !== "object")

export const traverseTemplate = (template: ObjectTemplate, templatesMap: Map<string, ObjectTemplate> = new Map(), name: string = "", depth: number = 0) => {

    templatesMap.set(JSON.stringify(template), template);

    template.name = name;
    template.depth = depth;

    if (template.value.object) {
        Object.entries(template.value.object).forEach(([key, temp]: [string, ObjectTemplate], idx) => {
            traverseTemplate(temp, templatesMap, `${name}_${key}`, depth + 1);
        })
    }

    if (template.value.array) {
        traverseTemplate(template.value.array, templatesMap, `${name}_array`, depth + 1);
    }
}

export const templateToInterface = (template: ObjectTemplate, name: string) => {
    const hasObject = !!template.value.object;
    const hasArray = !!template.value.array;
    const hasPrimitives = !!template.value.primitive;

    const interfaceString = `interface ${name} { }`;//this comes from object
    const typeString = `type ${name} `; //if has primitive --> return a type alias

    if (hasPrimitives) {
        const primitiveTypes = removeNonPrimitive(template.types);
        const primitivesTypeString = primitiveTypes.join("|");
    }

    // return {declaration,typeBody} declaration = type name + typeBody

}


/**create interface for object template, each prop will be an entry in the interface */
export const objectTemplateToInterface = (template: MapOfObjectTemplate, parentName = "") => {

}

export const arrayTemplateToInterface = (template: ObjectTemplate) => { }

type test = { a: string, b: number | null };

let testJson = {
    "asdfasd": { "a": 13, "b": "ciao" },
    "jhgfghj": { "a": 23, "b": "csdfvsdiao" },
    "asdfjhgvcjhgasd": { "a": -13, "b": "ciao" },
    "ffyjvhgvhg": { "a": 145433, "b": "csdfvsadfiao" }
}