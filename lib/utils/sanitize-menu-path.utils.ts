export const sanitizeMenuPath = (path: string) => {
  if (!path.startsWith('/') || !path.endsWith('/')) {
    throw new Error("Paths should to start and ends with '/' (slash)");
  }

  if (path.match(/\/\//)) {
    throw new Error("Paths can't to have double slash");
  }

  return path;
};
