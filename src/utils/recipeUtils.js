export const groupByIsland = (provinces) => {
  return provinces?.reduce((acc, province) => {
    const { islandGroupCode } = province;
    // Initialize the array if island doesn't exist
    if (!acc[islandGroupCode]) {
      acc[islandGroupCode] = [];
    }

    // Add the current province to the array
    acc[islandGroupCode].push(province);

    return acc;
  }, {});
};
