import { makeStyles } from '@material-ui/core/styles';
import {
  Avatar,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  IconButton,
  Input,
  TextField,
  Typography,
} from '@material-ui/core';

import React, { useContext, useEffect, useState } from 'react';
import {
  Comment,
  EmojiEmotionsOutlined,
  ExpandMore,
  Favorite,
  MoreVert,
  Share,
} from '@material-ui/icons';
import { format } from 'timeago.js';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import PostMenu from './PostMenu';
import CommentForm from './CommentForm';
import { Badge, CardFooter, Media } from 'reactstrap';
import { serverUrl } from '../config';
import '../global.css';

const useStyles = makeStyles((theme) => ({
  media: {
    height: '400px',

    [theme.breakpoints.down('sm')]: {
      height: 150,
    },
  },

  container: {
    height: 50,
    widht: 50,
    backgroundColor: 'black',
  },
  avatar: {
    backgroundColor: 'blue',
  },
  likeButton: {
    color: 'red',
  },
}));

function RenderComments({ comments, post, user }) {
  const comment_img = {
    height: 120,
    width: 120,
  };
  const comment_box = {
    height: 100,
    overflow: 'auto',
  };

  if (comments != null) {
    return (
      <div>
        <h5>Comments</h5>
        <div style={comment_box}>
          <Media list>
            {comments.map((comment) => {
              return (
                <div className='shadow'>
                  <Media className='p-2'>
                    <Media body>
                      <Media heading className={`ml-5 h6`}>
                        <div>{comment.userId}</div>
                      </Media>
                      <p className={`ml-5`}>{comment.comment}</p>
                    </Media>
                  </Media>
                </div>
              );
            })}
          </Media>
        </div>
        <hr />
        <CommentForm post={post} user={user} />
      </div>
    );
  } else return <div></div>;
}

const Posts = ({ post, index }) => {
  const classes = useStyles();

  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);

  const [user, setUser] = useState({});
  const { user: currentUser } = useContext(AuthContext);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [showComment, setShowComment] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser._id));
  }, [currentUser._id, post.likes]);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`${serverUrl}/users?userId=` + post.userId, {
        headers: {
          Authorization: 'bearer ' + currentUser.token,
        },
      });
      setUser(res.data);
    };
    fetchUser();
  }, [post.userId, currentUser.token]);

  const likeHandler = () => {
    try {
      axios.put(`${serverUrl}/posts/` + post._id + '/like', {
        userId: currentUser._id,
      });
    } catch (err) {}
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  };

  return (
    <>
      {/* <Container className={classes.container}></Container> */}
      <Card className='mb-5 postCard' id={post._id}>
        <CardActionArea>
          <CardHeader
            className='postCard-header'
            avatar={
              <Link to={`/Profile/${user.username}`}>
                <Avatar alt={user.username} src={user.profilePicture} />
              </Link>
            }
            action={
              <IconButton aria-label='settings'>
                <MoreVert
                  id='basic-button'
                  aria-controls='basic-menu'
                  aria-haspopup='true'
                  aria-expanded={open ? 'true' : undefined}
                  onClick={handleClick}>
                  Menu
                </MoreVert>
                {open ? (
                  <PostMenu
                    handleClick={handleClick}
                    handleClose={handleClose}
                    open={open}
                    anchorEl={anchorEl}
                    post={post}
                  />
                ) : (
                  <></>
                )}
              </IconButton>
            }
            title={
              <div>
                {user.username}
                {post.category ? (
                  <Badge color='secondary' style={{ marginLeft: '10px' }}>
                    {post.category}
                  </Badge>
                ) : (
                  <></>
                )}
                {post.admin ? (
                  <Badge color='primary' style={{ marginLeft: '10px' }}>
                    Mod
                  </Badge>
                ) : (
                  <></>
                )}
              </div>
            }
            subheader={format(post.createdAt)}
          />

          {post.image ? (
            <CardMedia
              className={classes.media}
              image={post.image}
              title='My post'
            />
          ) : (
            <></>
          )}

          <CardContent>
            <Typography variant='h5'>{post.title}</Typography>
            <Typography gutterBottom variant='body2'>
              {post.description}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <IconButton aria-label='share' lef>
            <Share />
          </IconButton>
          {isLiked ? (
            <IconButton aria-label='add to favorites'>
              <Favorite onClick={likeHandler} className={classes.likeButton} />
            </IconButton>
          ) : (
            <IconButton aria-label='add to favorites' onClick={likeHandler}>
              <Favorite />
            </IconButton>
          )}
          <Typography>{like} people Like this</Typography>
          <Typography
            className='ms-3'
            onClick={() => {
              setShowComment(!showComment);
            }}>
            {' '}
            {post.comments.length} comments{' '}
          </Typography>
        </CardActions>
        <CardFooter>
          <EmojiEmotionsOutlined className='m-2' fontSize='large' />
          <TextField
            className='commentTextField'
            variant='outlined'
            margin='dense'
            placeholder='Add a comment'>
            {' '}
          </TextField>
          <Button variant='outlined' className='mt-1 ms-3'>
            Post
          </Button>
          <Comment
            className='ms-3'
            fontSize='large'
            onClick={() => {
              setShowComment(!showComment);
            }}
          />

          {showComment ? (
            <RenderComments
              comments={post.comments}
              post={post}
              user={currentUser}
            />
          ) : (
            <></>
          )}
        </CardFooter>
      </Card>
    </>
  );
};
const style = {
  color: 'white',
  fontSize: 'x-small',
  maxWidth: '25px',
};
export default Posts;
