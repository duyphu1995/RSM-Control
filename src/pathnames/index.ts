import majorProjects from "./majorProjects/majorProjects";
import { getPathnames } from "./use-pathnames";

const pathnamesBase = {
  majorProjects
};

const pathnames = getPathnames(pathnamesBase) as typeof pathnamesBase;

export default pathnames;
