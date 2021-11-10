import { Avatar } from '@material-ui/core';
import axios from 'axios';
import { useEffect, useState } from 'react';
import './chatOnline.css';

export default function ChatOnline({ onlineUsers, currentId, setCurrentChat }) {
  const [friends, setFriends] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(() => {
    const getFriends = async () => {
      const res = await axios.get('/users/friends/' + currentId);
      setFriends(res.data);
    };

    getFriends();
  }, [currentId]);

  useEffect(() => {
    setOnlineFriends(friends.filter((f) => onlineUsers.includes(f._id)));
  }, [friends, onlineUsers]);

  const handleClick = async (user) => {
    try {
      let res = await axios.get(`/conversations/find/${currentId}/${user._id}`);
      !res.data
        ? (res = await axios.post('/conversations/', {
            senderId: currentId,
            receiverId: user._id,
          }))
        : setCurrentChat(res.data);
      setCurrentChat(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <div className='chatOnline'>
        <div>
          <h5>Online Friends</h5>
        </div>
        {onlineFriends ? (
          onlineFriends.map((o) => (
            <div className='chatOnlineFriend' onClick={() => handleClick(o)}>
              <div className='chatOnlineImgContainer'>
                <Avatar alt={o.username} src={o.profilePicture} />
                <div className='chatOnlineBadge'></div>
              </div>
              <span className='chatOnlineName'>{o?.username}</span>
            </div>
          ))
        ) : (
          <div>No Friends Are online</div>
        )}
      </div>
      <div className='chatOnline'>
        <h5>Offline Friends</h5>
        {friends ? (
          friends.map((friend) => (
            <div
              className='chatOnlineFriend'
              onClick={() => handleClick(friend)}>
              <div className='chatOnlineImgContainer'>
                <Avatar alt={friend.username} src={friend.profilePicture} />
              </div>
              <span className='chatOnlineName'>{friend?.username}</span>
            </div>
          ))
        ) : (
          <div>No Friends to show</div>
        )}
      </div>
    </div>
  );
}
