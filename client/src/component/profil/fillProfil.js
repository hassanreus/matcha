import React, { useEffect } from "react";
import Axios from "axios";
import {
  Chip,
  Paper,
  Collapse,
  Button,
  Grid,
  TextField,
  Typography,
  Container,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@material-ui/core";
// import { Autocomplete }from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";
import Size from "../helpers/size";
// import history from "../../history/history";

const useStyles = makeStyles((theme) => ({
  copy: {
    marginBottom: theme.spacing(8),
    textAlign: "center",
  },
  typo: {
    margin: theme.spacing(7),
  },
  paper: {
    marginTop: theme.spacing(6),
    display: "flex",
    flexDirection: "column",
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    color: "green",
  },
  root: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    listStyle: "none",
    padding: theme.spacing(0.5),
    margin: 0,
  },
  chip: {
    margin: theme.spacing(0.5),
  },
}));

const FillProfil = (props) => {
  const [value, setValue] = React.useState("male");
  const [biography, setBio] = React.useState("﴾͡๏̯͡๏﴿");
  const [tag, setTag] = React.useState("");
  // const [allTag, setAllTag] = React.useState([])
  const [errTag, setErrTag] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [open1, setOpen1] = React.useState(true);
  // const [hide, setHide] = React.useState(false);
  const [chipData, setChipData] = React.useState([]);
  const [dsbl, setDsbl] = React.useState(true);
  const classes = useStyles(props);

  // const [errMsg, setErr] = React.useState({});
  //   const [valid, setValid] = useState(false);

  useEffect(() => {
    Axios.post("base/tag").then((res) => {
      setChipData(res.data);
      // setAllTag(res.data)
    });
  }, []);
  const fill = async (e, id) => {
    e.preventDefault();
    await Axios.post("base/tag").then((res) => {
      // c = chipData.filter(
      //   (aObject) =>
      //     res.data.findIndex(
      //       (bObject) => aObject.valueOf() === bObject.valueOf()
      //     ) === -1
      // );
      for (var i = chipData.length - 1; i >= 0; i--) {
        for (var j = 0; j < res.data.length; j++) {
          if (chipData[i] && chipData[i].name === res.data[j].name)
            chipData.splice(i, 1);
        }
      }
      // c = chipData.filter(function (val) {
      //   return res.data.indexOf(val) === -1;
      // });
      // c = chipData.filter((x, key) => !res.data.includes(key));
    });
    console.log(chipData);
    Axios.post(`base/profil/${id}`, {
      // gender: value,
      // bio: biography,
      tag: chipData,
    }).then((res) => {
      console.log(res);
      // let data = { ...res.data.dataErr.msg, ...res.data.dataErr.msgTag };
      // if (res.data.dataErr.status) setErr(data);
      //   else if (res.data.status === "success") setValid(!valid);
    });
  };
  // console.log("errmgs: " + errMsg);
  const handelTag = (e) => {
    setTag(e.target.value);
    if (tag.match(/^#([A-Za-z0-9_]){3,25}$/) === null) {
      setErrTag("Enter a valid tag");
      setDsbl(true);
    } else {
      setErrTag("");
      setDsbl(false);
    }
  };

  const addToOption = (tag) => {
    if (errTag === "") {
      const id = chipData.slice(-1)[0].key + 1;
      chipData.push({ key: id, name: tag });
    }
  };

  const handleDelete = (chipToDelete) => () => {
    setChipData((chips) =>
      chips.filter((chip) => chip.key !== chipToDelete.key)
    );
  };

  return (
    <Size>
      <Container className={classes.copy} component="main" maxWidth="xs">
        <Typography className={classes.typo} component="h1" variant="h5">
          Fill profil
        </Typography>
        <div className={classes.paper}>
          <form
            method="POST"
            onSubmit={(event) => fill(event, props.match.params.id)}
          >
            <Grid container spacing={2}>
              <Typography variant="subtitle2" gutterBottom color="secondary">
                {/* {errMsg} */}
              </Typography>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Biography"
                  multiline
                  rows={3}
                  variant="outlined"
                  value={biography}
                  onChange={(e) => setBio(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Collapse in={open}>
                  <TextField
                    label="Add New Tag"
                    multiline
                    variant="outlined"
                    value={tag}
                    onChange={(e) => handelTag(e)}
                    helperText={errTag}
                    error={errTag !== ""}
                  />
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => {
                      setOpen(false);
                      setOpen1(true);
                      addToOption(tag);
                    }}
                    disabled={dsbl}
                  >
                    Add
                  </Button>
                </Collapse>
                <Collapse in={open1}>
                  <Button
                    disabled={open}
                    variant="outlined"
                    color="secondary"
                    onClick={() => {
                      setOpen(true);
                      setOpen1(false);
                    }}
                  >
                    New Tag
                  </Button>
                </Collapse>
                <Paper component="ul" className={classes.root}>
                  {chipData.map((data) => {
                    return (
                      <li key={data.key}>
                        <Chip
                          label={data.name}
                          onDelete={handleDelete(data)}
                          className={classes.chip}
                        />
                      </li>
                    );
                  })}
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Gender</FormLabel>
                  <RadioGroup
                    row
                    aria-label="gender"
                    name="gender1"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                  >
                    <FormControlLabel
                      value="women"
                      control={<Radio />}
                      label="Women"
                    />
                    <FormControlLabel
                      value="male"
                      control={<Radio />}
                      label="Male"
                    />
                    <FormControlLabel
                      value="both"
                      control={<Radio />}
                      label="Both"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="outlined"
              className={classes.submit}
            >
              Fill Profil
            </Button>
          </form>
        </div>
      </Container>
    </Size>
  );
};

export default FillProfil;
