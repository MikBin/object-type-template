import { objectToTemplate } from "../src/object-to-template"
import {inspect} from "util";
/**
 * object to template full test
 */
describe("objectToTEmplate test", () => {

  const testSource = {
    " ar": [1, 2, 3, "stella"],
    "n": 1,
    "c": "c",
    "o": {
      "test": "test"
    },
    "mixedArr": [{ "a": true, "b": "optional" }, null, { "a": 11 }, { "a": 12, "b": false }, [23, 45, "sss"], "dfg", "34.456"]
  }

  const expectedRes = {
    types: [ 'object' ],
    value: {
      primitive: null,
      object: {
        ' ar': {
          types: [ 'array' ],
          value: {
            primitive: null,
            object: null,
            array: {
              types: [ 'number', 'string' ],
              value: {
                primitive: [ 'number', 'string' ],
                object: null,
                array: null
              },
              optional: false
            }
          },
          optional: false
        },
        n: {
          types: [ 'number' ],
          value: { primitive: [ 'number' ], object: null, array: null },
          optional: false
        },
        c: {
          types: [ 'string' ],
          value: { primitive: [ 'string' ], object: null, array: null },
          optional: false
        },
        o: {
          types: [ 'object' ],
          value: {
            primitive: null,
            object: {
              test: {
                types: [ 'string' ],
                value: { primitive: [ 'string' ], object: null, array: null },
                optional: false
              }
            },
            array: null
          },
          optional: false
        },
        mixedArr: {
          types: [ 'array' ],
          value: {
            primitive: null,
            object: null,
            array: {
              types: [ 'string', 'array', 'object', 'null', 'number' ],
              value: {
                primitive: [ 'string', 'null', 'number' ],
                object: {
                  a: {
                    types: [ 'number', 'boolean' ],
                    value: {
                      primitive: [ 'number', 'boolean' ],
                      object: null,
                      array: null
                    },
                    optional: false
                  },
                  b: {
                    types: [ 'boolean', 'string' ],
                    value: {
                      primitive: [ 'boolean', 'string' ],
                      object: null,
                      array: null
                    },
                    optional: false
                  }
                },
                array: {
                  types: [ 'number', 'string' ],
                  value: {
                    primitive: [ 'number', 'string' ],
                    object: null,
                    array: null
                  },
                  optional: false
                }
              },
              optional: false
            }
          },
          optional: false
        }
      },
      array: null
    },
    optional: false
  };

  it("works", () => {
    const res = objectToTemplate(testSource);
   
    expect(res).toEqual(expectedRes);
  })


})
