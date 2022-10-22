export const isStyleTransformKeys = {
  translate: true,
  translateX: true,
  translateY: true,
  translateZ: true,
  scale: true,
  scaleX: true,
  scaleY: true,
  scaleZ: true,
  rotate: true,
  rotateX: true,
  rotateY: true,
  rotateZ: true,
  skew: true,
  skewX: true,
  skewY: true,
};

export const parseTransformStyle = (style: {
  [key: string]: number | string;
}) => {
  const { nonTransformStyles, transformStyles } =
    separateTransformStyles(style);

  return {
    ...nonTransformStyles,
    transform: getTransform(transformStyles),
  };
};

export const separateTransformStyles = (style: {
  [key: string]: number | string;
}) => {
  const nonTransformStyles = {};
  const transformStyles: {
    [key in keyof typeof isStyleTransformKeys]?: number | string;
  } = {};
  Object.keys(style).forEach((styleKey) => {
    const value = style[styleKey];
    if (styleKey in isStyleTransformKeys) {
      transformStyles[styleKey] = value;
    } else {
      nonTransformStyles[styleKey] = value;
    }
  });

  return {
    nonTransformStyles,
    transformStyles,
  };
};

// get transform string from keys
export const getTransform = (style: {
  [key in keyof typeof isStyleTransformKeys]?: number | string;
}) =>
  Object.keys(style)
    .map((styleProp) => getTransformValueWithUnits(styleProp, style[styleProp]))
    .reduce((transform, currentValue) => (transform += ` ${currentValue}`), "")
    .trim();

// MARK: - splitCSSValueAndUnit
function splitCSSValueAndUnit(value: string) {
  const valueMatch = value.match(/(-)?(\d+.)?\d+/g);
  const unitMatch = value.match(
    /px|rem|em|ex|%|cm|mm|in|pt|pc|ch|vh|vw|vmin|vmax/
  );

  return {
    value: Number(valueMatch),
    unit: unitMatch && unitMatch[0],
  };
}

// MARK: - getValueUnit
function getValueUnit(property: string, value: string) {
  let unit;

  const splitValue = splitCSSValueAndUnit(String(value)).value;
  const splitUnit = splitCSSValueAndUnit(String(value)).unit;

  // if string value is passed with unit then split it
  if (splitUnit) {
    return { value: splitValue, unit: splitUnit };
  }

  if (
    property.indexOf("translate") !== -1 ||
    property.indexOf("perspective") !== -1
  ) {
    unit = "px";
  } else if (property.indexOf("scale") !== -1) {
    unit = "";
  } else if (
    property.indexOf("rotate") !== -1 ||
    property.indexOf("skew") !== -1
  ) {
    unit = "deg";
  }

  return { value, unit };
}

// MARK: - getTransformValueWithUnits
function getTransformValueWithUnits(property: string, value: string) {
  const valueUnit = getValueUnit(property, value);

  if (
    property.indexOf("X") !== -1 ||
    property.indexOf("Y") !== -1 ||
    property.indexOf("Z") !== -1 ||
    property.indexOf("rotate") !== -1 ||
    property.indexOf("skew") !== -1
  ) {
    return `${property}(${valueUnit.value}${valueUnit.unit})`;
  } else if (
    property.indexOf("translate") !== -1 ||
    property.indexOf("scale") !== -1
  ) {
    return `${property}(${valueUnit.value}${valueUnit.unit}, ${valueUnit.value}${valueUnit.unit})`;
  } else {
    throw new Error(`Error! Property '${property}' cannot be transformed`);
  }
}
