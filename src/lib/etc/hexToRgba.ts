//hex to rgba
const isValidHex = (hex: string) => /^#([A-Fa-f0-9]{3,4}){1,2}$/.test(hex);

const getChunksFromString = (st: string, chunkSize: number) =>
  st.match(new RegExp(`.{${chunkSize}}`, "g"));

const convertHexUnitTo256 = (hexStr: string) => parseInt(hexStr.repeat(2 / hexStr.length), 16);

const getAlphafloat = (a: number | undefined, alpha: number) => {
  if (typeof a !== "undefined") {
    return a / 255;
  }

  if (typeof alpha != "number" || alpha < 0 || alpha > 1) {
    return 1;
  }
  return alpha;
};

export const hexToRGBA = (hex: string, alpha: number) => {
  if (!isValidHex(hex)) {
    throw new Error("Invalid HEX");
  }
  const chunkSize = Math.floor((hex.length - 1) / 3);
  const hexArr = getChunksFromString(hex.slice(1), chunkSize);
  if (!hexArr) {
    console.log("hexArr is null");
    return;
  }
  const [r, g, b, a] = hexArr.map(convertHexUnitTo256);
  return `rgba(${r}, ${g}, ${b}, ${getAlphafloat(a, alpha)})`;
};

//console.log(hexToRGBA("#0084ff", 1));
//rgba(0, 132, 255, 1)
//console.log(hexToRGBA("#1976d2", 1));
//rgba(25, 118, 210, 1)
//console.log(hexToRGBA("#1565c0", 1));
//rgba(21, 101, 192, 1)

console.log(hexToRGBA("#1976D2", 1));
//rgba(25, 118, 210, 1)
export default hexToRGBA;
