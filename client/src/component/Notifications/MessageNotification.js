import React from 'react';
// import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import Axios from "axios"
import Badge from '@material-ui/core/Badge';
import MailIcon from '@material-ui/icons/Mail';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import { StylesProvider } from "@material-ui/core/styles";
import "./notifications.css";
import { makeStyles } from '@material-ui/core/styles';

import SocketContext from "../../start/SocketContext";

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',

        maxWidth: '36ch',
        backgroundColor: theme.palette.background.paper,
    },
    inline: {
        display: 'inline',
    },
    Troot: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    // bdg : {
    //     backgroundColor: 'pink'
    // }
}));

const MessageNotification = (props) => {
    const classes = useStyles();

    const socket = React.useContext(SocketContext);
    const [messageNumber, SetmessageNumber] = React.useState(0);
    const [msgNotifications, setMsgNotifications] = React.useState([]);

    function isEmpty(obj) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                return false;
            }
        }

        return true;
    }

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        SetmessageNumber(0);
        getUserNotifs(props)
    };

    const getUserNotifs = (props) => {
        Axios.post('http://localhost:3001/notifications/getUserNotifs', { userId: props.myInfos.id })
            .then((res) => {
                if (isEmpty(res.data.whoInfos) === false) {
                    setMsgNotifications(res.data.whoInfos);
                }
            }).catch((Err) => {  })
    }

    const handleClose = () => {
        setAnchorEl(null);
    };

    const snn = (x) => {
        SetmessageNumber(" ");
    }

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    React.useEffect(() => {
    socket.on('new_msg', (data) => {
        if (data.target === props.myInfos.id)
            snn(messageNumber);
    })
    }, [messageNumber, socket, props]);
    return (
        <StylesProvider injectFirst>

            <div className={classes.Troot}>
                <Badge className={classes.bdg} badgeContent={messageNumber} aria-describedby={id} color="secondary" onClick={handleClick}>
                <MailIcon />
                </Badge>
                <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                >
                    {
                        (msgNotifications.length === 0) ? <Typography>nulllllllllll</Typography>
                            :
                            msgNotifications.map((el, key) => {
                                if (el.type === "message") {
                                    return (
                                        <List className={classes.root} key={key}>

                                            <ListItem alignItems="flex-start">
                                                <ListItemAvatar>
                                                    <Avatar alt={`${el.userName}image`} src={`http://localhost:3001/${el.image}`} />
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={el.userName}
                                                    secondary={
                                                        <React.Fragment>
                                                            <Typography
                                                                component="span"
                                                                variant="body2"
                                                                className={classes.inline}
                                                                color="textPrimary"
                                                            >
                                                                {' '}
                                                            </Typography>
                                                            {`New message from ${el.userName }`}
                                                        </React.Fragment>
                                                    }
                                                />
                                            </ListItem>
                                            <Divider variant="inset" component="li" />

                                        </List>
                                    )
                                }
                                return '';
                            })
                    }

                </Popover>
                {/* <Badge badgeContent={messageNumber} color="primary">
                        <MailIcon />
            </Badge> */}
                {/* <Badge badgeContent={notifNumber} color="primary">
                <NotificationsIcon />
            </Badge> */}
            </div>
        </StylesProvider>
    )
};





export default MessageNotification;