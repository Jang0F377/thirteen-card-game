import chalk from 'chalk';
import ora, {Color, Ora} from 'ora';
import {type SpinnerName} from 'cli-spinners';

interface ChalkLogInterface {
  color: Color;
  message: string;
}

export function chalkLog(props: ChalkLogInterface) {
  switch (props.color) {
    case 'blue':
      console.log(chalk.blue(`${props.message}`));
      break;
    case 'red':
      console.log(chalk.red(props.message));
      break;
    case 'green':
      console.log(chalk.green(props.message));
      break;
    case 'magenta':
      console.log(chalk.magenta(props.message));
      break;
    case 'yellow':
      console.log(chalk.yellow(props.message));
      break;
    case 'cyan':
      console.log(chalk.cyan(props.message));
      break;
    case 'white':
      console.log(chalk.white(props.message));
      break;
    default:
      console.log(props.message);
      break;
  }
}

interface SpinnerLogInterface {
  spinnerType: SpinnerName;
  spinnerMessage?: string;
  spinnerColor?: Color;
}

export function spinnerLog(props: SpinnerLogInterface): Ora {
  let spinner: Ora;

  // Default to green if no color specified
  if (!props.spinnerColor) {
    props.spinnerColor = 'green';
  }

  // No message specified
  if (!props.spinnerMessage) {
    delete props.spinnerMessage;
    spinner = ora({
      color: props.spinnerColor,
      spinner: props.spinnerType,
    });

    return spinner.start();
  }

  spinner = ora({
    color: props.spinnerColor,
    spinner: props.spinnerType,
    text: props.spinnerMessage,
  });

  return spinner.start();
}
