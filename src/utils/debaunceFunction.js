export const debaunceFunction = (func, delay) => {
    let timer;

    return function () {
      let context = this;
      const args = arguments;
      clearTimeout(timer);

      timer = setTimeout(() => {
        func.apply(context, args);
      }, delay);
    };
  };