export const getPathnames = (object: any, parentPath: string = "") => {
  let temp = {};

  Object.keys(object).forEach(key => {
    const value = object[key];
    let newValue: any;

    switch (key) {
      case "main": {
        newValue = {
          ...value,
          path: parentPath + value.path
        };
        break;
      }

      case "path": {
        const mainPath = parentPath || "";
        newValue = mainPath + value;
        break;
      }

      case "name": {
        newValue = value;
        break;
      }

      default: {
        newValue = getPathnames(value, parentPath + (object.main?.path || ""));
      }
    }

    temp = { ...temp, [key]: newValue };
  });

  return temp;
};
