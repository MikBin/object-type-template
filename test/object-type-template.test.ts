import { OBJECT_MAP_PROP } from "../src/interfaces";
import { objectToTemplate } from "../src/object-to-template"
import { objectTemplateSimilarity } from "../src/template-check";

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
    expect(res.value.object[OBJECT_MAP_PROP]).toBeDefined();
  })

})
