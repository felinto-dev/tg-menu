export const sanitizeMenuPath = (path: string) => {
  if (path.startsWith('/')) {
    path = path.slice(1);
  }

  if (path.endsWith('/')) {
    path = path.slice(0, path.length - 1);
  }

  if (path.match(/\/\//)) {
    throw new Error("Paths can't to have double slash");
  }

  return path;
};
