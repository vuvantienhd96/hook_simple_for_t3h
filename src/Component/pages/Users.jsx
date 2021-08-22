import React, { useState, useEffect } from 'react'
// add meterial
import {
  alpha,
  ThemeProvider,
  withStyles,
  makeStyles,
  createTheme,
} from '@material-ui/core/styles';
import { TextField, Button } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';
import WorkIcon from '@material-ui/icons/Work';
import BeachAccessIcon from '@material-ui/icons/BeachAccess';

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
    margin: theme.spacing(1),
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

  // mock image
  const [viewImage, setViewImage] = useState('https://picsum.photos/seed/picsum/200/300')

  const [image, setImage] = useState(null);
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
    if(e.target.files[0]){
      setImage(e.target.files[0])
    }
    
  }

  const handleUploadImage = () => {
    const uploadImage = storage.ref(`images/${image.name}`).put(image);
    uploadImage.on(
      "state_changed",
      snapshot => {},
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

  console.log('$image', image);
  

  return (
    <React.Fragment>
      <form className={classes.root} noValidate>
        <TextField
          className={classes.margin}
          label="First Name"
          variant="outlined"
          id="mui-theme-provider-outlined-input"
          value={firstName}
          onChange={(e) => { setFirstName(e.target.value) }}
        />
        <TextField
          className={classes.margin}
          label="Last Name"
          variant="outlined"
          id="mui-theme-provider-outlined-input"
          value={lastName}
          onChange={(e) => { setLastName(e.target.value) }}
        />

        {/* input file change */}
        <input type="file" onChange={handleChangeFile} />
        <img style={{width: '100px', height: '100px', borderRadius: '50%'}} src={viewImage} alt="demo" />
        
        <Button variant="contained"
          className={classes.widthButton}
          color="primary"
          size="small"
          onClick={handleUploadImage}
        >
          Upload Image
        </Button>
        <Button variant="contained"
          className={classes.widthButton}
          color="primary"
          size="small"
          onClick={handleClickAddData}
        >
          Submit
        </Button>
      </form>
      <List className={classes.root}>
        {dataList && dataList.map(el => {
          return <ListItem key={el.id}>
            <ListItemAvatar>
              <Avatar>
                {/* <ImageIcon /> */}
                {el.img && <img style={{height: '40px', width: '40px', borderRadius: '50%'}} src={el.img} alt={el.img} />}
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={el.firstName} secondary={el.lastName} />
            
          </ListItem>
        }
        )}
      </List>
    </React.Fragment>
  )
}
