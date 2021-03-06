import { EOL } from "os";
import { Transformer } from "./transformer";

function setCharAt(str: string, index: number, chr: number) {
  if (index > str.length - 1) return str;
  return str.substr(0, index) + chr + str.substr(index + 1);
}

const androidTransformer: Transformer = {
  transformComment(comment) {
    return "    <!-- " + comment + " -->";
  },
  transformKeyValue(key, value) {
    let normalizedValue = value.replace(/%newline%/gi, "\\n");
    normalizedValue = normalizedValue.replace(/'/gi, "\\'");
    normalizedValue = normalizedValue.replace(/%([sdf])/gi, "%#$$$1");
    normalizedValue = normalizedValue.replace(/&/gi, "&amp;");
    normalizedValue = normalizedValue.replace(/\u00A0/gi, "\\u00A0");
    normalizedValue = normalizedValue.replace(
      /([^.]|^)(\.{3})([^.]|$)/gi,
      "$1&#8230;$3"
    );

    let ouput =
      '    <string name="' + key + '">' + normalizedValue + "</string>";

    let currPos = 0;
    let nbOcc = 1;

    while ((currPos = ouput.indexOf("%#$", currPos)) !== -1) {
      ouput = setCharAt(ouput, currPos + 1, nbOcc);
      ++currPos;
      ++nbOcc;
    }

    return ouput;
  },
  transformPluralsValues(key, values) {
    let ouput = '    <plurals name="' + key + '">' + EOL;

    for (let i = 0; i < values.length; i++) {
      let normalizedValue = values[i].value.replace(/%newline%/gi, "\\n");
      normalizedValue = normalizedValue.replace(/'/gi, "\\'");
      normalizedValue = normalizedValue.replace(/%([sdf])/gi, "%#$$$1");
      normalizedValue = normalizedValue.replace(/&/gi, "&amp;");
      normalizedValue = normalizedValue.replace(/\u00A0/gi, "\\u00A0");
      normalizedValue = normalizedValue.replace(
        /([^.]|^)(\.{3})([^.]|$)/gi,
        "$1&#8230;$3"
      );

      ouput +=
        '        <item quantity="' +
        values[i].getPluralKey() +
        '">' +
        normalizedValue +
        "</item>" +
        EOL;

      let currPos = 0;
      let nbOcc = 1;

      while ((currPos = ouput.indexOf("%#$", currPos)) !== -1) {
        ouput = setCharAt(ouput, currPos + 1, nbOcc);
        ++currPos;
        ++nbOcc;
      }
    }

    ouput += "    </plurals>";

    return ouput;
  },
  AUTOGENERATED_TAG: "    <!-- AUTO-GENERATED -->",
  async insert(input, newValues) {
    const AUTOGENERATED_TAG = androidTransformer.AUTOGENERATED_TAG;

    if (!input) {
      input = "";
    }

    let output = "";
    const closeTagIndex = input.indexOf("</resources>");
    if (closeTagIndex < 0) {
      output =
        '<?xml version="1.0" encoding="utf-8"?>' + EOL + "<resources>" + EOL;
    } else {
      const autoGeneratedIndex = input.indexOf(AUTOGENERATED_TAG as string);
      if (autoGeneratedIndex >= 0) {
        output = input.substr(0, autoGeneratedIndex);
      } else {
        output = input.substr(0, closeTagIndex);
      }
    }

    output += AUTOGENERATED_TAG + EOL + newValues + EOL + "</resources>";

    return output;
  },
  getFileName: (item) => `values-${item.toLowerCase()}strings.xml`,
};

export default androidTransformer;
