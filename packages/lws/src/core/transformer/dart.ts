import { EOL } from "os";
import { Transformer } from "./transformer";

export const dartTransformer: Transformer = {
  transformComment(comment) {
    return "  // " + comment;
  },
  transformKeyValue(key, value) {
    let normalizedValue = value.replace(/%newline%/gi, "\\n");
    normalizedValue = normalizedValue.replace(/"/gi, '\\"');
    normalizedValue = normalizedValue.replace(/%([@df])/gi, "%$1");
    normalizedValue = normalizedValue.replace(/%s/gi, "%@");

    return '  "' + key + '" : "' + normalizedValue + '",';
  },
  AUTOGENERATED_TAG: "// AUTO-GENERATED",
  insert(input, newValues, options) {
    if (!input) {
      input = "";
    }

    const generatedIndex = input.indexOf(dartTransformer.AUTOGENERATED_TAG);
    if (generatedIndex >= 0) {
      input = input.substr(0, generatedIndex);
    }

    const header = options && options.header ? options.header : "";
    const footer = options && options.footer ? options.footer : "";

    const output =
      input +
      dartTransformer.AUTOGENERATED_TAG +
      EOL +
      header +
      "{" +
      EOL +
      newValues +
      EOL +
      "};" +
      footer;

    return output;
  },
  getFileName: () => /* TODO */ "",
};

export const dartTemplateTransformer: Transformer = {
  transformComment(comment) {
    return "  // " + comment;
  },
  transformKeyValue(key) {
    // let normalizedValue = value.replace(/%newline%/gi, "\\n");
    // normalizedValue = normalizedValue.replace(/"/gi, '\\"');
    // normalizedValue = normalizedValue.replace(/%([@df])/gi, "%$1");
    // normalizedValue = normalizedValue.replace(/%s/gi, "%@");

    return "  String get " + key + ' => get("' + key + '");';
  },
  AUTOGENERATED_TAG: "// AUTO-GENERATED",
  insert(input, newValues, options) {
    if (!input) {
      input = "";
    }

    const generatedIndex = input.indexOf(
      dartTemplateTransformer.AUTOGENERATED_TAG
    );
    if (generatedIndex >= 0) {
      input = input.substr(0, generatedIndex);
    }

    const className = options && options.className ? options.className : "T";
    const header =
      options && options.header ? options.header : "library core.t";
    const baseClass =
      options && options.baseClass ? options.baseClass : "TranslationSet";

    const output =
      input +
      dartTemplateTransformer.AUTOGENERATED_TAG +
      EOL +
      header +
      EOL +
      EOL +
      "class " +
      className +
      " extends " +
      baseClass +
      " { " +
      EOL +
      EOL +
      "  " +
      className +
      "(values): super(values);" +
      EOL +
      EOL +
      newValues +
      EOL +
      "}";

    return output;
  },
  getFileName: () => /* TODO */ "",
};