import axios from "axios";

type RandomUser = {
  name: {
    title: string;
    first: string;
    last: string;
  };
  picture: string;
  id: string;
};

export const getOneOrMinusOne = () => {
  return Math.random() == 1 ? 1 : -1;
};

export const getRandomUser = async () => {
  return new Promise<RandomUser>((resolve, reject) => {
    axios("https://randomuser.me/api/", { responseType: "json" })
      .then((res) => {
        const name = res.data.results[0].name;
        const picture = res.data.results[0].picture.large;
        const id = res.data.results[0].id.value;

        resolve({ name, picture, id });
      })
      .catch((e) => reject(e));
  });
};

export const getRandomPic = () => {
  return new Promise<string>((resolve, reject) => {
    axios("https://picsum.photos/1200/600")
      .then((res) => {
        resolve(res.request.res.responseUrl);
      })
      .catch((e) => reject(e));
  });
};
