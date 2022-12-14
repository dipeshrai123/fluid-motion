import * as Global from "../global";

const isCustomPropRE = /^--/;

type Value = string | number | boolean | null;

function dangerousStyleValue(name: string, value: Value) {
  if (value == null || typeof value === "boolean" || value === "") return "";
  if (
    typeof value === "number" &&
    value !== 0 &&
    !isCustomPropRE.test(name) &&
    !(isUnitlessNumber.hasOwnProperty(name) && isUnitlessNumber[name])
  )
    return value + "px";
  // Presumes implicit 'px' suffix for unitless numbers
  return ("" + value).trim();
}

const attributeCache: { [key: string]: string } = {};

type Instance = HTMLDivElement & { style: any; [key: string]: any };

export const applyAnimatedValues = {
  current: function applyAnimatedValues(
    instance: Instance,
    props: { [key: string]: any }
  ): any {
    if (!instance.nodeType || !instance.setAttribute) {
      return false;
    }

    const isFilterElement =
      instance.nodeName === "filter" ||
      (instance.parentNode && instance.parentNode.nodeName === "filter");

    const { style, children, scrollLeft, scrollTop, ...attributes } = props;

    const values = Object.values(attributes);
    const names = Object.keys(attributes).map((name) =>
      isFilterElement || instance.hasAttribute(name)
        ? name
        : attributeCache[name] ||
          (attributeCache[name] = name.replace(
            /([A-Z])/g,
            // Attributes are written in dash case
            (n) => "-" + n.toLowerCase()
          ))
    );

    if (children !== void 0) {
      instance.textContent = children;
    }

    const { nonTransformStyles, transformStyles } =
      Global.separateTransformStyles(style);

    // Apply CSS styles
    for (let name in nonTransformStyles) {
      if (nonTransformStyles.hasOwnProperty(name)) {
        const value = dangerousStyleValue(name, nonTransformStyles[name]);
        if (name === "float") name = "cssFloat";
        else if (isCustomPropRE.test(name)) {
          instance.style.setProperty(name, value);
        } else {
          instance.style[name] = value;
        }
      }
    }

    // Apply CSS transform styles
    instance.style.transform = Global.getTransform(transformStyles);

    // Apply DOM attributes
    names.forEach((name, i) => {
      instance.setAttribute(name, values[i]);
    });

    if (scrollLeft !== void 0) {
      instance.scrollLeft = scrollLeft;
    }

    if (scrollTop !== void 0) {
      instance.scrollTop = scrollTop;
    }
  },
  transformStyles: function transformStyles(style: any) {
    return style;
  },
  inject(apply: any, transform: any) {
    applyAnimatedValues.current = apply;
    applyAnimatedValues.transformStyles = transform;
  },
};

const isUnitlessNumber: { [key: string]: true } = {
  animationIterationCount: true,
  borderImageOutset: true,
  borderImageSlice: true,
  borderImageWidth: true,
  boxFlex: true,
  boxFlexGroup: true,
  boxOrdinalGroup: true,
  columnCount: true,
  columns: true,
  flex: true,
  flexGrow: true,
  flexPositive: true,
  flexShrink: true,
  flexNegative: true,
  flexOrder: true,
  gridRow: true,
  gridRowEnd: true,
  gridRowSpan: true,
  gridRowStart: true,
  gridColumn: true,
  gridColumnEnd: true,
  gridColumnSpan: true,
  gridColumnStart: true,
  fontWeight: true,
  lineClamp: true,
  lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  tabSize: true,
  widows: true,
  zIndex: true,
  zoom: true,
  // SVG-related properties
  fillOpacity: true,
  floodOpacity: true,
  stopOpacity: true,
  strokeDasharray: true,
  strokeDashoffset: true,
  strokeMiterlimit: true,
  strokeOpacity: true,
  strokeWidth: true,
};
