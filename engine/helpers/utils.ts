export const clone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj))
}

export const distinct = <T>(array: T[]): T[] => {
  return array.filter((value, index, list) => list.indexOf(value) === index)
}

export const shuffleArray = <T>(array: T[]): T[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
