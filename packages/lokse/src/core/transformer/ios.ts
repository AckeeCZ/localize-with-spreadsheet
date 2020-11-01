import { EOL } from "os";
import { Transformer } from "./transformer";

const iOSTransformer: Transformer = {
  transformComment(comment) {
    return "// " + comment;
  },
  transformKeyValue(key, value) {
    let normalizedValue = value.replace(/%newline%/gi, "\\n");
    normalizedValue = normalizedValue.replace(/"/gi, '\\"');
    normalizedValue = normalizedValue.replace(/%([@df])/gi, "%$1");
    normalizedValue = normalizedValue.replace(/%s/gi, "%@");

    return '"' + key + '" = "' + normalizedValue + '";';
  },
  AUTOGENERATED_TAG: "// AUTO-GENERATED",
  async insert(input, newValues) {
    if (!input) {
      input = "";
    }

    const generatedIndex = input.indexOf(
      iOSTransformer.AUTOGENERATED_TAG as string
    );
    if (generatedIndex >= 0) {
      input = input.substr(0, generatedIndex);
    }

    const output = input + iOSTransformer.AUTOGENERATED_TAG + EOL + newValues;

    return output;
  },
  getFileName: (item) => `${item.toLowerCase()}.lproj/Localizable.strings`,
};

export default iOSTransformer;
