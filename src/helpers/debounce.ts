function debounce<Params extends any[]>(
  func: (...args: Params) => any,
  timeout = 300
) {
  let timer: NodeJS.Timeout;

  return (...args: Params) => {
    clearTimeout(timer);

    timer = setTimeout(() => {
      func(...args);
    }, timeout);
  };
}

export default debounce;
