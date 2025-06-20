type CommandCallback = () => any;

const commandMap: Record<string, CommandCallback> = {};

export function registerCommand(commandName: string, dataList: any[]) {
  commandMap[commandName] = () => {
    const randomIndex = Math.floor(Math.random() * dataList.length);
    return dataList[randomIndex];
  };
}

export function executeCommand(commandName: string) {
  const command = commandMap[commandName];
  if (command) {
    return command();
  } else {
    throw new Error(`Command "${commandName}" is not registered.`);
  }
}
