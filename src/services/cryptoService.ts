export const wait = async (delay: number = 500) => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, delay);
  });
};

export const encrypt = async (data: any) => {
  await wait(500);
  return data;
};

export const decrypt = async (data: any) => {
  await wait(500);
  return data;
};
