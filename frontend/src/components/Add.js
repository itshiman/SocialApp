import {
  Avatar,
  Container,
  Fab,
  FormControl,
  InputLabel,
  makeStyles,
  MenuItem,
  Modal,
  Select,
  Snackbar,
  TextField,
  Tooltip,
} from '@material-ui/core';
import {
  Add as AddIcon,
  Cancel,
  EmojiEmotions,
  Label,
  PermMedia,
  Room,
} from '@material-ui/icons';
import { useContext, useRef, useState } from 'react';
import MuiAlert from '@material-ui/lab/Alert';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import './add.css';
import { serverUrl } from '../config';

const useStyles = makeStyles((theme) => ({
  fab: {
    position: 'fixed',
    bottom: 20,
    right: 20,
  },
  container: {
    width: 600,
    height: 500,
    backgroundColor: 'white',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    margin: 'auto',
    [theme.breakpoints.down('sm')]: {
      width: '100vw',
      height: '100vh',
    },
  },
  form: {
    padding: theme.spacing(2),
  },
  item: {
    marginBottom: theme.spacing(3),
  },

  shareImg: {
    width: '100%',
    objectFit: 'cover',
  },
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant='filled' {...props} />;
}

const Add = () => {
  const classes = useStyles();
  const desc = useRef();
  const title = useRef();
  const [file, setFile] = useState(null);
  const { user } = useContext(AuthContext);
  const [category, setCategory] = useState('');

  const handleChange = (event) => {
    setCategory(event.target.value);
  };

  const submitHandler = async (e) => {
    setOpenAlert(true);
    setOpen(false);
    setFile(null);
    e.preventDefault();

    const newPost = {
      title: title.current.value,
      userId: user._id,
      description: desc.current.value,
      category: category,
    };
    if (file) {
      const data = new FormData();
      const fileName = Date.now() + file.name;
      data.append('name', fileName);
      data.append('file', file);
      newPost.image = fileName;
      console.log(newPost);
      try {
        const res = await axios.get(`${serverUrl}/upload/s3Url`);
        const url = res.data.url;
        console.log(res);
        console.log(url);
        const resS3 = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: file,
        });
        console.log(resS3);
        const imageUrl = url.split('?')[0];
        console.log(imageUrl);
        newPost.image = imageUrl;
      } catch (err) {
        console.log(err);
      }
    }
    try {
      await axios.post(`${serverUrl}/posts`, newPost, {
        headers: {
          Authorization: 'bearer ' + user.token,
        },
      });
      //window.location.reload();
    } catch (err) {}
  };

  const [open, setOpen] = useState(false);

  const [openAlert, setOpenAlert] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenAlert(false);
  };
  return (
    <>
      <Tooltip title='Add' aria-label='add' onClick={() => setOpen(true)}>
        <Fab id='add' color='primary' className={classes.fab}>
          <AddIcon />
        </Fab>
      </Tooltip>
      <Modal open={open}>
        <Container className={classes.container}>
          <div className='share'>
            <div className='shareWrapper'>
              <div className='shareTop'>
                <Avatar
                  alt={user.username}
                  src={user.profilePicture}
                  className='shareProfileImg'
                />
                <form>
                  <div>
                    <TextField
                      id='standard-basic'
                      label='Title'
                      variant='standard'
                      inputRef={title}
                    />
                  </div>
                  <div>
                    <TextField
                      multiline
                      id='standard-basic-1'
                      label='Description'
                      variant='standard'
                      inputRef={desc}
                      style={{ width: '400px' }}
                    />
                  </div>
                  <div>
                    <FormControl fullWidth>
                      <InputLabel id='demo-simple-select-label'>
                        Category
                      </InputLabel>
                      <Select
                        labelId='demo-simple-select-label'
                        id='demo-simple-select'
                        label='Category'
                        value={category}
                        onChange={handleChange}>
                        <MenuItem value={'Web Development'}>
                          Web Development
                        </MenuItem>
                        <MenuItem value={'Android Development'}>
                          Android Development
                        </MenuItem>
                        <MenuItem value={'Data Structures'}>
                          Data Strucutres
                        </MenuItem>
                        <MenuItem value={'Machine Learning'}>
                          Machine Learning
                        </MenuItem>
                        <MenuItem value={'Block Chain'}>Block Chain</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                </form>
              </div>
              {/* <input
                  placeholder={'Share Something ' + user.username + '?'}
                  className='shareInput'
                  ref={title}
                />
                <input
                  placeholder={"What's in your mind " + user.username + '?'}
                  className='shareInput'
                  ref={desc}
                /> */}
              <hr className='shareHr' />
              {file && (
                <div className='shareImgContainer'>
                  <img
                    className='shareImg'
                    src={URL.createObjectURL(file)}
                    alt=''
                  />
                  <Cancel
                    className='shareCancelImg'
                    onClick={() => setFile(null)}
                  />
                </div>
              )}
              <form className='shareBottom' onSubmit={submitHandler}>
                <div className='shareOptions'>
                  <label htmlFor='file' className='shareOption'>
                    <PermMedia htmlColor='tomato' className='shareIcon' />
                    <span className='shareOptionText'>Photo or Video</span>

                    <input
                      style={{ display: 'none' }}
                      type='file'
                      id='file'
                      accept='.png,.jpeg,.jpg'
                      onChange={(e) => setFile(e.target.files[0])}
                    />
                  </label>
                </div>
                <button className='shareButton' type='submit' id='share'>
                  Share
                </button>
                <button
                  className='shareButton'
                  type='button'
                  id='cancel'
                  onClick={() => {
                    setOpen(false);
                    setFile(null);
                  }}>
                  Cancel
                </button>
              </form>
            </div>
          </div>
        </Container>
      </Modal>
      <Snackbar
        open={openAlert}
        autoHideDuration={2000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
        <Alert onClose={handleClose} severity='success'>
          This is a success message!
        </Alert>
      </Snackbar>
    </>
  );
};

export default Add;
