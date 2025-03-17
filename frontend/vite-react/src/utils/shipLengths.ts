export const getShipLengthById = (id: number): number => {
  switch (id) {
    case 1:
      return 5;
    case 2:
      return 4;
    case 3:
      return 3;
    case 4:
      return 3;
    case 5:
      return 2;
    default:
      return 0;
  }
};
