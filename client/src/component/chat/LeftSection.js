import React from "react";
import PropTypes from "prop-types";
// import SwipeableViews from "react-swipeable-views";
import { makeStyles, useTheme, withStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import { Tabs, Tab, AppBar, List ,ListItem ,ListItemText ,ListItemAvatar, Avatar, Badge } from '@material-ui/core';

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

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`
  };
}

const useStyles = makeStyles((theme) => ({
  Left: {
    backgroundColor: theme.palette.background.paper,
    height: "70vh"
  }
}));

const FullWidthTabs = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  // const [value, setValue] = React.useState(0);

  // const handleChange = (event, newValue) => {
  //   setValue(newValue);
  // };

  // const handleChangeIndex = (index) => {
  //   setValue(index);
  // };
  
  return (
    <div className={classes.Left}>
      <AppBar position="static" color="default">
        <Tabs
          value={0}
          // onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label="Chats" {...a11yProps(0)} />
          {/* <Tab label="People(matched)" {...a11yProps(1)} /> */}
        </Tabs>
      </AppBar>
      {/* <SwipeableViews */}
        {/* axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
        onChangeIndex={handleChangeIndex}
      > */}
        {/* <TabPanel value={value} index={0} dir={theme.direction}>
          Conversations.....
        </TabPanel> */}
        <TabPanel
          id="99909090090"
          value={0}
          index={0}
          dir={theme.direction}
        >
          <div>
            <List id="0101010">
              {props.people && props.people.map((item, index) => {
                if (item){
                  const { userName, id, image } = item;
                  const labelId = `checkbox-list-secondary-label-${index}`;
                  return (
                    <ListItem
                      key={index}
                      onClick={() => {
                        props.passHisInfos({
                          userName: userName,
                          id: id,
                          image: image,
                        });
                      }}
                    >
                      <ListItemAvatar>
                        <StyledBadge
                          overlap="circle"
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                          }}
                          variant="dot"
                        >
                          <Avatar
                            alt={`${userName} picture`}
                            src={`http://localhost:3001/${image}`}
                          />
                        </StyledBadge>
                      </ListItemAvatar>
                      <ListItemText id={labelId} primary={userName} />
                    </ListItem>
                  );
                }
                return '';
              })
            }
            </List>
          </div>
        </TabPanel>
      {/* </SwipeableViews> */}
    </div>
  );
}

export default FullWidthTabs