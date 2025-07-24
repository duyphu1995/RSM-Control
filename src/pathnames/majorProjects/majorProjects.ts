import { ROUTES } from "@/constants/routes";

const main = {
  name: "Major Projects List",
  path: ROUTES.MAJOR_PROJECT
};

const mainMobile = {
  name: "Major Projects",
  path: ROUTES.MAJOR_PROJECT
};

const viewJobsList = {
  name: "Major Projects List - Jobs List",
  path: ROUTES.JOBS_LIST
};

const viewJobsListMobile = {
  name: "Projects Jobs List",
  path: ROUTES.JOBS_LIST
};

const majorProjects = {
  main,
  mainMobile,
  viewJobsList,
  viewJobsListMobile
};

export default majorProjects;
