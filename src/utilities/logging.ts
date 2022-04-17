import chalk from "chalk";
import _ from "lodash";

export function goodLog(...args: any[]) {
  console.log(chalk.bgBlack.green(...arguments));
}

export function badLog(...args: any[]) {
  console.log(chalk.bgBlack.redBright(...arguments));
}

export function logLog(...args: any[]) {
  console.log(chalk.bgBlack.magentaBright(...arguments));
}

export function logEntity(object: Object) {
  console.log(chalk.bgBlue.bold.yellow(object.constructor.name));
  _.toPairsIn(object).forEach((i) => console.log(chalk.bgBlue.yellow(`${i[0]}: ${i[1]}`)));
}
