export const URLst = "http://127.0.0.1:8000/api/";

export const primary_color = "#434CE7";
export const success_color = "#52c41a";
export const warning_color = "#faad14";
export const error_color = "#ff4d4f";
export const handle401 = () => {
  localStorage.clear();
};
export const replaceObject = ({ dataList = [], singledata = {} }) => {
  let newData = [...dataList];
  let index = newData.findIndex((av) => av.id === singledata.id);
  newData[index] = singledata;

  return newData;
};
