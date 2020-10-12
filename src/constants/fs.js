

const checkFile = (path) => {
  try {
    return require(`@/config/${path}`).default;
  } catch {
    return false;
  }
};

export default { checkFile };
