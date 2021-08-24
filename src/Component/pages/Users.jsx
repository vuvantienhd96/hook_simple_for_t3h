import React, { useState, useEffect } from 'react'
// add meterial
import {
  alpha,
  ThemeProvider,
  withStyles,
  makeStyles,
  createTheme,
} from '@material-ui/core/styles';
import {
  FormControl,
  ListItemAvatar,
  ListItemText,
  ListItem,
  List,
  TextField,
  Button,
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Alert from '@material-ui/lab/Alert';

//icon delete
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import CreateIcon from '@material-ui/icons/Create';


// import firebase 
import firebase from './../../firebase';

const CssTextField = withStyles({
  root: {
    '& label.Mui-focused': {
      color: 'green',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'green',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'red',
      },
      '&:hover fieldset': {
        borderColor: 'yellow',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'green',
      },
    },
  },
})(TextField);

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  margin: {
    //margin: theme.spacing(1),
  },
  widthButton: {
    width: '6rem',
    marginTop: '0.5rem',
    height: '3.5rem',
  }
}));

export default function Users() {
  const classes = useStyles()
  // useState 
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dataList, setDataList] = useState([]);

  // update state form
  const [uFirstName, setUFirstName] = useState('');
  const [uLastName, setULastName] = useState('');
  const [uUserID, setuUserId] = useState(null);

  // mock image
  const [viewImage, setViewImage] = useState('https://picsum.photos/seed/picsum/200/300')

  const [image, setImage] = useState(null);


  // handle state show edit and add
  const [showEdit, setShowEdit] = useState(false);

  // function Click
  const storage = firebase.storage();

  const handleClickAddData = () => {
    let fireStore = firebase.database().ref('/UserTable');
    let data = {
      firstName,
      lastName,
      img: viewImage
    };
    try {
      fireStore.push(data);
      console.log('push success!');
      setFirstName('');
      setLastName('');

    } catch (error) {
      console.log("error", error);

    }
  }

  const handleChangeFile = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0])
    }

  }

  const handleUploadImage = () => {
    if (image === null || image === undefined) {
      alert("you must choose file image !");
      return;
    }
    const uploadImage = storage.ref(`images/${image.name}`).put(image);
    uploadImage.on(
      "state_changed",
      snapshot => { },
      error => {
        console.log(error);

      },
      () => {
        storage.ref("images")
          .child(image.name)
          .getDownloadURL()
          .then(url => {
            console.log('$url', url);
            setViewImage(url)
          });
      }
    )
  }



  useEffect(() => {
    // get list data here
    const fireStore = firebase.database().ref('/UserTable')
    fireStore.on('value', (res) => {
      const data = res.val();
      let userList = [];
      for (let id in data) {
        userList.push({
          id,
          firstName: data[id].firstName,
          lastName: data[id].lastName,
          img: data[id].img ? data[id].img : 'https://picsum.photos/id/237/200/300'
        })
      }
      setDataList(userList);
    })

  }, [])

  const _handleUpdateUser = (user) => {
    setShowEdit(true);
    setUFirstName(user.firstName);
    setULastName(user.lastName);
    setuUserId(user.id)
  }

  const _handledeleteUser = (user) => {
    console.log('$user', user.id);
    const fireStore = firebase.database().ref('/UserTable').child(user.id).remove();
  }

  const handleClickUpdateDataData =() =>{
    const fireStore = firebase.database().ref('/UserTable');
    fireStore.child(uUserID).update({
      firstName: uFirstName,
      lastName: uLastName
    })
    setUFirstName('');
    setULastName('');
    setuUserId(null);
    setShowEdit(false);
  }

  const handleClickCancelUpdateDataData = () => {
    setShowEdit(false);
  }

  return (
    <React.Fragment>

      <Grid container alignContent={"center"} alignItems={"center"} justifyContent={"center"}>
        <Grid item xs={8} >
          <Grid container>
            {!showEdit ?
              <Grid item xs={6}>
                <Typography variant="h4" component="h4">
                  Hey this is form User
                </Typography>
                <TextField
                  className={classes.margin}
                  label="First Name"
                  variant="outlined"
                  id="mui-theme-provider-outlined-input"
                  value={firstName}
                  onChange={(e) => { setFirstName(e.target.value) }}
                  fullWidth={true}
                />
                <TextField
                  className={classes.margin}
                  label="Last Name"
                  variant="outlined"
                  id="mui-theme-provider-outlined-input"
                  value={lastName}
                  onChange={(e) => { setLastName(e.target.value) }}
                  fullWidth={true}
                />
                <Button variant="contained"
                  className={classes.widthButton}
                  color="primary"
                  size="small"
                  onClick={handleClickAddData}
                >
                  Submit
                </Button>
              </Grid>

              :
              <Grid item xs={6}>
                <Alert severity="info">This is a edit screen !</Alert>
                <Grid item xs={6}>
                  <TextField
                    className={classes.margin}
                    label="First Name"
                    variant="outlined"
                    id="mui-theme-provider-outlined-input"
                    value={uFirstName}
                    onChange={(e) => { setUFirstName(e.target.value) }}
                    fullWidth={true}
                    style={{padding: '1.1rem 0'}}
                  />
                  <TextField
                    style={{padding: '1.1rem 0'}}
                    className={classes.margin}
                    label="Last Name"
                    variant="outlined"
                    id="mui-theme-provider-outlined-input"
                    value={uLastName}
                    onChange={(e) => { setULastName(e.target.value) }}
                    fullWidth={true}
                  />
                  <Button variant="contained"
                    className={classes.widthButton}
                    color="primary"
                    size="small"
                    onClick={handleClickUpdateDataData}
                  >
                    Submit
                  </Button>
                  <Button variant="contained"
                    className={classes.widthButton}
                    color="primary"
                    size="small"
                    onClick={handleClickCancelUpdateDataData}
                  >
                    Cancel
                  </Button>
                </Grid>

              </Grid>
            }

          </Grid>
          <FormControl fullWidth>
            <Grid container spacing={3}>
              {/* add image bellow */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardMedia
                    image={viewImage}
                    title="Contemplative Reptile"
                    style={{ width: 'auto', height: '200px' }}
                  />
                  <CardContent>
                    <Typography gutterBottom component="h2">
                      Lizard
                    </Typography>
                    <Typography component="p">
                      Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
                      across all continents except Antarctica
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="primary">

                      <TextField
                        className={classes.margin}
                        variant="outlined"
                        id="file"
                        onChange={handleChangeFile}
                        fullWidth={true}
                        type="file"
                      />
                    </Button>
                    <Button variant="contained"
                      className={classes.widthButton}
                      color="primary"
                      size="small"
                      onClick={handleUploadImage}
                    >
                      Upload Image
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
              {/* table here */}
              <Grid item xs={12} md={6}>
                {dataList && dataList.length > 0 &&
                  <TableContainer>
                    <Table aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Full name</TableCell>
                          <TableCell align="center">Avatar</TableCell>
                          <TableCell align="center">edit</TableCell>
                          <TableCell align="center">remove</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {dataList.map((row) => (
                          <TableRow key={row.id}>
                            <TableCell component="th" scope="row">
                              {row.firstName} {' '} {row.lastName}
                            </TableCell>
                            <TableCell align="center">
                              <Avatar>
                                {row.img && <img style={{ height: '40px', width: '40px', borderRadius: '50%' }} src={row.img} alt={row.img} />}
                              </Avatar>
                            </TableCell>
                            <TableCell align="center">
                              <Button onClick={() => _handleUpdateUser(row)}>
                                <CreateIcon color={'primary'} />
                              </Button>
                            </TableCell>
                            <TableCell align="center">
                              <Button onClick={() => _handledeleteUser(row)}>
                                <DeleteForeverIcon color={'error'} />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                }
                {
                  dataList && dataList.length === 0 &&
                  <Alert severity="warning">This is a warning alert — check it out!</Alert>
                }
              </Grid>
            </Grid>
          </FormControl>
        </Grid>
      </Grid>
    </React.Fragment>
  )
}
