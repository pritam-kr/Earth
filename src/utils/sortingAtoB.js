export const sortingAtoB = (array, type) => {
  let copied = [...array];

  return !copied.length
    ? []
    : type === "country"
    ? copied?.sort(function (a, b) {
        if (a.name.common < b.name.common) {
          return -1;
        }
        if (a.name.common > b.name.common) {
          return 1;
        }
        return 0;
      })
    : type === "state"
    ? copied?.sort(function (a, b) {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      })
    : copied;
};
