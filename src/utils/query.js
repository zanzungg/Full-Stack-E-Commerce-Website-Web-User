export const cleanQueryParams = (params) => {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([_, v]) => v !== '' && v !== null && v !== undefined
    )
  );
};
