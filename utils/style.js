import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  navbar: {
    backgroundColor: "#203040",
    "& a": {
      color: "#ffffff",
      marginLeft: 10,
    },
  },
  secondbar: {
    backgroundColor: "#2596be",
    "& a": {
      color: "#ffffff",
      marginLeft: 10,
    },
  },
  brand: {
    fontWeight: "bold",
    fontSize: " 1.5rem",
  },
  grow: {
    flexGrow: 1,
  },
  sizePlus: {
    fontSize: "20px",
    margin: 30,
  },
  main: {
    minHeight: "80vh",
    minWidth: "80vw",
  },
  footer: {
    textAlign: "center",
  },
  secondtext: {
    fontSize: "23px",
  },
  section: {
    marginTop: 10,
    marginBottom: 10,
  },
  addButton: {
    primary: {
      main: "#2596be", //changed color to lighter blue
    },
    secondary: {
      main: "#2596be",
    },
  },
  form: {
    width: "100%",
    maxWidth: 800,
    margin: "0 auto",
  },
  navbarButton: {
    color: "#ffffff",
    textTransform: "initial",
  },
  transparentBackground: {
    backgroundColor: "transparent",
  },
  error: {
    color: "#f04040",
  },
  fullWidth: {
    width: "100%",
  },
});
export default useStyles;
