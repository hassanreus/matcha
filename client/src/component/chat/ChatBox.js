import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Input, Grid } from '@material-ui/core/';
// import MuiAlert from '@material-ui/lab/Alert';
import SocketContext from "../../start/SocketContext";
import Axios from "axios";
import "./ChatBox.js";
// import { keys } from "@material-ui/core/styles/createBreakpoints";

// import { io } from "socket.io-client";
// const URL = "http://localhost:3001";
// const socket = io(URL);


const useStyles = makeStyles(() => ({
    chatBox: {
        height: '100%',
        backgroundColor: 'white',
        position: "relative",
    },
    messages: {
        padding: '14px',
        // position: 'relaive',
    },
    textInput: {
        position: "absolute",
        bottom: 0,
        color: 'purple',
        width: '100%',
    },
    right: {
        wordBreak: 'break-all',
        padding: '10px',
    },
    left: {
        wordBreak: 'break-all',
        padding: '10px',
    },
    myText: {
        width: 'fit-content',
        borderRadius: '7px',
        backgroundColor: '#e6b4e4',
        padding: '10px',
        float: 'right',
    },
    hisText: {
        color: 'white',
        width: 'fit-content',
        borderRadius: '7px',
        backgroundColor: '#000000a8',
        padding: '10px',

    },

}));
const isEmpty = (obj) => {
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            return false;
        }
    } return true;
}

console.log('123456879')

// LINE 70 , 109, 190
const ChatBox = (props) => {
    const [conversation, setCoversation] = React.useState([]);
    // DECLARING A NEW USESTATE
    const [msgRight, setRightMsg] = React.useState([]);
    const classes = useStyles();

    const socket = React.useContext(SocketContext);


    React.useEffect(() => {
        // console.log('IDIDIDIDIDI', props.id);
        if (!isEmpty(props.hisInfos)) {
            Axios.post('http://localhost:3001/chat/getConversation', { user1: props.id, user2: props.hisInfos.id })
                .then((res) => {
                    if (res.data.response.length != 0) {
                        // console.log('resConv', res.data.response);
                        setCoversation(res.data.response);
                        // displayMessages(res.data.response, props.myInfos, props.hisInfos);
                    }
                    if (res.data.response === "") {
                        setCoversation([]);
                        // console.log("Say Hello");
                    }
                })
                .catch((err) => { console.log('ErR' + err) });
        }

    }, [props.hisInfos])

    const sendMessage = (e) => {
        e.preventDefault();
        if (props.hisInfos) {
            var input = document.getElementById('msg');
            if (e.keyCode === 13 && input.value) {
                saveMessage(input.value);
                // socket msg
                Axios.post('http://localhost:3001/notifications/saveNotifications', { who: props.id, target: props.hisInfos.id, type: "message" })
                    .then((res) => {
                        console.log('reSdddd000003', res.status);
                    })
                socket.emit('msg', { text: input.value, from: props.myInfos.id, to: props.hisInfos.id });

                // SAVING A NEW MSG IN LIST //////////////////////////////////////
                setRightMsg(e => [...e, input.value]);
                // THIS INPUT VALUE = "" BLOCK STATEMENT OF LOADING A NEW MSGS //
                // input.value = '';
                /////////////////////////////////////////////////////////////////

                // input.value ===> append ==> me right
                // console.log('13');
            }
        } else {
            console.log('cant find hisInfos')
        }
    }

    React.useEffect(() => {
        socket.on('new_msg', (data) => {
            // alert(1)
            
            console.log('--------------------------------------')
            console.log('Data', data);
        });

    }, [])

    React.useEffect(() => {
        console.log(msgRight);
    }, [msgRight]);

    const saveMessage = (content) => {
        Axios.post('http://localhost:3001/chat/saveMessage', { from: props.id, to: props.hisInfos.id, content: content })
            .then((res) => {
                // console.log(res);
                // if (res.data.response === true)
                    // socket.emit('new')
            }).catch((err) => { console.log(err) });
    }

    // console.log('len****', conversation);
    // console.log('-props', props.hisInfos)
    if (!isEmpty(props.hisInfos)) {
        return (
            <div className={classes.chatBox}>
                <Grid container direction="column" spacing={2} className="messages">
                    {
                        conversation.length != 0 && (
                            conversation.map((element) => {
                                if (element.id_from == props.myInfos.id) {
                                    return (
                                        //hnaya1
                                        <Grid item container className={classes.me}>
                                            <Grid item sm={4}></Grid>
                                            <Grid item sm={8} className={classes.right}>
                                                <div className={classes.myText}>
                                                    {element.content}
                                                </div>
                                            </Grid>
                                        </Grid>
                                    )
                                } else {
                                    return (
                                        <Grid item container className={classes.him}>
                                            <Grid item sm={8} className={classes.left}>
                                                <div className={classes.hisText}>
                                                    {element.content}
                                                </div>
                                            </Grid>
                                            <Grid item sm={4}></Grid>
                                        </Grid>
                                    )
                                }
                            })
                        )
                    }
                    {
                        !conversation.length && (
                            <div>
                                Say Hello
                            </div>
                        )
                    }

                    {/* PRINTING THE MSGS HERE WITH A NEW BLOCK */}
                    {
                        msgRight && msgRight.map(el => {
                            return (
                                //hnaya1
                                <Grid item container className={classes.me}>
                                <Grid item sm={4}></Grid>
                                <Grid item sm={8} className={classes.right}>
                                    <div className={classes.myText}>
                                    {el}
                                    </div>
                                </Grid>
                                </Grid>
                            );
                        })
                    }
                </Grid>
                <Input id="msg" type="text" className={classes.textInput} placeholder="Message" onKeyUp={sendMessage} />
            </div>
        )
    }

    else {
        return (
            <div className={classes.chatBox}>
                <p>select the user you want to chat with</p>
            </div>
        )
    }
}

export default ChatBox;