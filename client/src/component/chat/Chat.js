import React from "react";
import Axios from "axios";
import ChatBox from "./ChatBox";
import { Grid, List ,ListItem ,ListItemText ,ListItemAvatar,Avatar, Badge } from '@material-ui/core';
import { withStyles } from '@material-ui/core';
// we have to get id of connected user & email of user to cha with;
// ids will make the room's name

const StyledBadge = withStyles((theme) => ({
    badge: {
      backgroundColor: '#44b700',
      color: '#44b700',
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      '&::after': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        animation: '$ripple 1.2s infinite ease-in-out',
        border: '1px solid currentColor',
        content: '""',
      },
    },
    '@keyframes ripple': {
      '0%': {
        transform: 'scale(.8)',
        opacity: 1,
      },
      '100%': {
        transform: 'scale(2.4)',
        opacity: 0,
      },
    },
  }))(Badge);

const ChatList = (props) => {

    const [people, setPeople] = React.useState([]);
    const [hisInfos, setHisInfos] = React.useState({});
    const [myInfos, setMyInfos] = React.useState({})

    const saveMyInfos = (value) => {
      if(!myInfos)
      {
        setMyInfos(value);
      }
    }

    // getting people matched with (id, userName, profilPicture);

    React.useEffect(() => {
      Axios.post('http://localhost:3001/chat/getConnectedUserInfos', {userId: props.id})
      .then((res) => {
          if(res)
            saveMyInfos(res.data.myInfos);
        
      }).catch((err) => {console.log(err)})

      Axios.post('http://localhost:3001/chat/people', {userId : props.id})
      .then((res) => {
          if(res.data.boards)
          {
              var result = res.data.boards
              setPeople([...result]);
          }
      }).catch((err) => {console.log(err)})

    }, [myInfos])

    const passHisInfos = (x) => {
        setHisInfos(x);
    }
    
    return (
      <div>
        <Grid container spacing={1} style={{background: '#EEEEEE', height: '70vh'}}>
          <Grid item md={2}>
              <h4>People</h4>
              <h4>Messages</h4>
              <hr />
              <List>
              {
                people.map((item, index) => {
                    const {userName, id, image} = item;
                    const labelId = `checkbox-list-secondary-label-${index}`;
                    return (
                      <ListItem key={index} onClick={(e) => {passHisInfos({userName:userName, id:id, image:image})}}>
                          <ListItemAvatar>
                          <StyledBadge                      
                          overlap="circle"
                          anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                          }}
                          variant="dot">
                              <Avatar
                                  alt={`${userName} picture`}
                                  src={`http://localhost:3001/${image}`}
                              />
                              </StyledBadge>
                          </ListItemAvatar>
                          <ListItemText id={labelId} primary={userName} />
                      </ListItem>   
                    );
                })
              }
              </List>
          </Grid>
          <Grid item md={8} style={{border: '0.5px white solid'}}>
            <ChatBox
              id={props.id}  
              myInfos={myInfos} 
              hisInfos={hisInfos}
            />
          </Grid>
          <Grid item md={2}>
            <h3>Profile & Utilitie</h3>
          </Grid>
        </Grid>
      </div>
    )
}

export default ChatList;