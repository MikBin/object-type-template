import { IsJsonable, ObjectTemplate, primitive } from "./interfaces";
import { matchNumber } from "./utilities";

//compare source with object template properties and types
const objectTemplateSimilarity = exports.objectTemplateSimilarity = (source: IsJsonable<object | primitive>, objectTemplate: ObjectTemplate, counter = { match: 0, total: 0 })
    : { match: number, total: number } => {
        
    const sourceType: string = typeof source;
    const sourceIsNumber: boolean = sourceType === "number" || (sourceType === "string" && matchNumber(<string>source));

    if (objectTemplate.types.includes("array")) {

        if (!Array.isArray(source)) { counter.total++; return counter };
        //if array the model(template) contains an array with just one element representing the type of all array's elements
        let innerModel = objectTemplate.value;
        source.forEach((entrySource) => {
            objectTemplateSimilarity(entrySource, <ObjectTemplate>innerModel.array, counter);
        });


    } else if (objectTemplate.types.includes("object")) {

        const templateEntries = Object.entries(objectTemplate.value);

        if (sourceType !== "object") {
            counter.total += templateEntries.length;
            return counter;
        }

        templateEntries.forEach(([propName, typeValue], idx) => {
            if (Reflect.has(<object>source, propName)) objectTemplateSimilarity(Reflect.get(<IsJsonable<object>>source, propName), typeValue, counter);
            else counter.total++;
        });

    } else {
        //primitive
        let count = objectTemplate.types.includes(sourceType) ? 1 : 0;
        counter.match += count;
        counter.total++;
    }

    return counter;

}
