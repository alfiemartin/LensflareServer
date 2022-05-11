import axios from "axios";
import { Coords, RandomUser } from "../types";

export const getOneOrMinusOne = () => {
  return Math.random() == 1 ? 1 : -1;
};

export const getRandomCoords = (): Coords => {
  return [getOneOrMinusOne() * Math.random() * 180, getOneOrMinusOne() * Math.random() * 90];
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
