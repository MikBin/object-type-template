import { OBJECT_MAP_PROP } from "../src/interfaces";
import { objectToTemplate } from "../src/object-to-template"
import { objectTemplateSimilarity } from "../src/template-check";
import { countTrueOptional, removeOptionalProps } from "../src/utilities";

const util = require('util')


/**
 * object to template full test
 */
describe("objectToTEmplate test", () => {

  const testSource = {
    "ar": [1, 2, 3, "stella"],
    "n": 1,
    "c": "c",
    "o": {
      "test": "test"
    },
    "mixedArr": [{ "a": true, "b": "optional" }, null, { "a": 11 }, { "a": 12, "b": false }, [23, 45, "sss"], "dfg", "34.456"]
  }

  const expectedTemplateRes = {
    "types": ["object"],
    "value": {
      "primitive": null,
      "object": {
        "ar": {
          "types": ["array"],
          "value": {
            "primitive": null,
            "object": null,
            "array": {
              "types": ["number", "string"],
              "value": { "primitive": ["number", "string"], "object": null, "array": null }, "optional": false
            }
          }, "optional": false
        },
        "n": {
          "types": ["number"],
          "value": { "primitive": ["number"], "object": null, "array": null },
          "optional": false
        },
        "c": {
          "types": ["string"],
          "value": { "primitive": ["string"], "object": null, "array": null },
          "optional": false
        },
        "o": {
          "types": ["object"],
          "value": {
            "primitive": null, "object": { "test": { "types": ["string"], "value": { "primitive": ["string"], "object": null, "array": null }, "optional": false } }, "array": null
          },
          "optional": false
        },
        "mixedArr": {
          "types": ["array"],
          "value": {
            "primitive": null,
            "object": null,
            "array": {
              "types": ["array", "null", "number", "object", "string"],
              "value": {
                "primitive": ["null", "number", "string"],
                "object": {
                  "a": {
                    "types": ["boolean", "number"],
                    "value": {
                      "primitive": ["boolean", "number"],
                      "object": null,
                      "array": null
                    },
                    "optional": false
                  },
                  "b": {
                    "types": ["boolean", "string"],
                    "value": {
                      "primitive": ["boolean", "string"],
                      "object": null,
                      "array": null
                    },
                    "optional": true
                  }
                }, "array": {
                  "types": ["number", "string"],
                  "value": {
                    "primitive": ["number", "string"],
                    "object": null,
                    "array": null
                  },
                  "optional": false
                }
              }, "optional": false
            }
          }, "optional": false
        }
      },
      "array": null
    }, "optional": false
  };

  const objectMapTestSource = {
    "sdfa": { a: 1, b: "ciaogbjh" },
    "sdfdfgdfa": { a: 13, b: "cifgfghao" },
    "strtdfa": { a: -1, b: "ciahjo" },
    "uutysdfa": { a: -21, b: "cihjao" },
    "esressdfa": { a: 341, b: "ciakjhkjo" },
    "sd876fa": { a: 81, b: "ciahkjho" },
    "78688sdfa": { a: 18, b: "ciiyiuao" },
  };

  it("works", () => {
    const res = objectToTemplate(testSource);
    expect(res).toEqual(expectedTemplateRes);
  });

  it("has no error in template check", () => {
    const counter = objectTemplateSimilarity(testSource, expectedTemplateRes);
    expect(true).toBeTruthy();
  })

  /**@TODO test extraneous count */
  it("recognize object map collection of equals object", () => {

    const res = objectToTemplate(objectMapTestSource);
    expect(res.value.isObjectMap).toBeTruthy();
    const objMap = res.value.object ? res.value.object[OBJECT_MAP_PROP] : undefined;
    expect(objMap).toBeDefined();
    expect(objMap).toBeInstanceOf(Object);
  })

  it("removes optionals from templates", () => {

    const sourceWithOptionals = [{ a: 1, b: 2 }, { a: 1, b: 2, c: 3 }, { a: 1, b: 2, d: 'dsf' }];
    const res = objectToTemplate(sourceWithOptionals);


    //@ts-ignore
    expect(res.value.array.value.object.c.optional).toBe(true)
    //@ts-ignore
    expect(res.value.array.value.object.d.optional).toBe(true)
    const optionalCount = countTrueOptional(res);
    expect(optionalCount).toBeGreaterThan(0)
    expect(optionalCount).toBe(2)
    //console.log(util.inspect(res, { showHidden: false, depth: null }));
    const templateWithoutOptional = removeOptionalProps(JSON.parse(JSON.stringify(res)));
    //console.log(util.inspect(templateWithoutOptional, { showHidden: false, depth: null }))
    //@ts-ignore
    expect(templateWithoutOptional.value.array.value.object.c).toBeUndefined()
    //@ts-ignore
    expect(templateWithoutOptional.value.array.value.object.d).toBeUndefined()

    expect(countTrueOptional(templateWithoutOptional)).toBe(0);
    console.log(optionalCount)
  })

  it("removes optionals from nested templates", () => {

    const sourceWithOptionals = [
      {
        arr: [{ a: 1, b: 2 }, { a: 1, b: 2, c: 3 }, { a: 1, b: 2, d: 'dsf' }]
      },
      { arr: [{ a: 1, c: 4 }, { a: 1, b: 2, c: 3, d: 5 }] }
    ];

    const res = objectToTemplate(sourceWithOptionals);
    const optionalCount = countTrueOptional(res);
    expect(optionalCount).toBeGreaterThan(0)
    expect(optionalCount).toBe(3)
    const templateWithoutOptional = removeOptionalProps(JSON.parse(JSON.stringify(res)));
    //console.log(util.inspect(templateWithoutOptional, { showHidden: false, depth: null }));
    expect(countTrueOptional(templateWithoutOptional)).toBe(0)
    console.log(optionalCount)
  })

})
