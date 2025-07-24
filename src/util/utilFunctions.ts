export const mapErrors = (err: string): any => {
  try {
    const parsed = JSON.parse(err);

    if (Array.isArray(parsed) && parsed[0]?.message) {
      return parsed;
    }

    return [{ message: "parsed content is not a  zod error format" }];
  } catch (err) {
    return [{ message: "Invalid JSON format in error.message" }];
  }
};

export const fillEmptyObject = (source: any, fallback: any) => {
  const result = { ...source };
  for (const key in fallback) {
    if (result[key] == undefined || result[key] == null) {
      result[key] = fallback[key];
    }
  }
  return result;
};
