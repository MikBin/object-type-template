import { ObjectTemplate } from "../src/interfaces";
import { templateSimilarity } from "../src/template-similarity";

describe("testing templateSimilarity function", () => {


    const templateMulti = <ObjectTemplate>
        {
            types: ["object", "array"],
            optional: false,
            value:
            {
                primitive: null,
                object: {
                    test: {
                        optional: false,
                        types: ["string"],
                        value: {
                            primitive: ["string"],
                            object: null,
                            array: null
                        }
                    }
                },
                array: {
                    optional: false,
                    types: ["number"],
                    value: { primitive: ["number"], object: null, array: null }
                }
            }
        };

    const templateMultiB = <ObjectTemplate>
        {
            types: ["object", "array"],
            optional: false,
            value:
            {
                primitive: null,
                object: {
                    test: {
                        optional: false,
                        types: ["string"],
                        value: {
                            primitive: ["string"],
                            object: null,
                            array: null
                        }
                    },
                    test2: {
                        optional: false,
                        types: ["number"],
                        value: {
                            primitive: ["number"],
                            object: null,
                            array: null
                        }
                    }
                },
                array: {
                    optional: false,
                    types: ["number"],
                    value: { primitive: ["number"], object: null, array: null }
                }
            }
        };

    it("should get 100% for exact match on primite only", () => {

        const templateA = <ObjectTemplate>{ types: ["string"], value: { object: null, array: null, primitive: ["string"] } };
        const templateB = <ObjectTemplate>{ types: ["string"], value: { object: null, array: null, primitive: ["string"] } };
        const { match, total } = templateSimilarity(templateA, templateB);
        expect(match).toEqual(total);

    })

    it("should get 100% for exact match on multi types", () => {

        const templateB = templateMulti;
        const { match, total } = templateSimilarity(templateMulti, templateB);
        expect(match).toEqual(total);

    })

    it("should get less than 100% for similar templates", () => {

        const { match, total } = templateSimilarity(templateMulti, templateMultiB);
        expect(match).toEqual(total - 1);

    })

})
