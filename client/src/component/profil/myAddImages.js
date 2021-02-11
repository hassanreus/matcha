import React from 'react'
import Axios from 'axios'
// import Size from '../helpers/size'
import {
  // GridListTile,GridList,CircularProgress,Fab,Button,
  Grid
  // ,Typography,Container,
} from '@material-ui/core'
// import {Alert} from '@material-ui/lab'
// import { Add, EventSeat } from '@material-ui/icons'
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
// import { Item1 } from "./items";
import { makeStyles } from "@material-ui/core/styles";
import { IoMdAddCircle } from "react-icons/io";
import { useState, useRef, useEffect } from "react";

// isDragDisable ==> isDD
const intialItems = [
    {
      id: "0",
      value: "",
      isDragDisabled: true,
      // isDropDisabled: true,
      disabled: false
    },
    {
      id: "1",
      value: "",
      isDragDisabled: true,
      // isDropDisabled: true,
      disabled: false
    },
    {
      id: "2",
      value: "",
      isDragDisabled: true,
      // isDropDisabled: true,
      disabled: false
    },
    {
      id: "3",
      value: "",
      isDragDisabled: true,
      // isDropDisabled: true,
      disabled: false
    },
    {
      id: "4",
      value: "",
      isDragDisabled: true,
      // isDropDisabled: true,
      disabled: false
    }
  ];
  const useStyles = makeStyles(() => ({
    big: {
      position: "relative",
      backgroundColor: "#E0E4E9",
      width: "200px",
      height: "300px",
      borderRadius: "10px",
      border: "2px solid white"
    },
    addCircle: {
      position: "absolute",
      right: "4px",
      top: "4px",
      color: "pink",
      width: "40px",
      height: "40px"
    }
  }));

const MyAddImages = (props) => {
  const classes = useStyles();
  const [Items, UpdateItems] = useState(intialItems);
  const imageRefs = useRef([]);
  const [ProfileImg, SetProfileImg] = useState(null);
  const ProfImgRef = useRef(null);
  const [effect, triggerEffect] = useState(false);
  // const [isDD, SetIsDD] = useState(true);
  // const [disabled, SetDisabled] = useState(true);

  imageRefs.current = [];

  const addToRefs = (el) => {
    if (el && !imageRefs.current.includes(el)) {
      imageRefs.current.push(el);
    }
  };


    // display of images

    const displayProfileImg = React.useCallback(() => {
      if (ProfileImg != null) {
        var ProfileImgDiv = ProfImgRef.current;
        ProfileImgDiv.style.background = "url(" + ProfileImg + ")";
        ProfileImgDiv.style.backgroundSize = "400px 600px";
      }
    }, [ProfileImg])

    useEffect(() => {
      displayProfileImg()
    }, [displayProfileImg])

  //////////////////////////

  // count of images

  const fetchImgs = React.useCallback(async () => {
    await Axios.post(`/base/img/fetch/${props.id}`, { userId: props.id }).then(
      (res) => {
        console.log(res.data.s)
        if (res.data.s === 1) props.checkTotalImg()
      }
    )
  }, [props])
    
  useEffect(() => {
    fetchImgs()
  }, [fetchImgs])

  ////////////////////////////

  const triggerInput = (index) => {
    if (imageRefs.current[index]) {
      imageRefs.current[index].click();
    }
  };

  const handleChange = async (event, id, index) => {
    if (event.target.files[0]) {
      var value = URL.createObjectURL(event.target.files[0]);
      if (index === 0) {
        SetProfileImg(value);
      }
      triggerEffect(!effect);
      if (value != null) {
        var tmp = Items;
        tmp[index].value = value;
        UpdateItems(tmp);
        const gridId = imageRefs.current[index].id + "img";
        const grid = document.getElementById(gridId);
        grid.style.background = "url(" + value + ")";
        grid.style.backgroundSize = "200px 300px";
      } 
    }

    event.preventDefault();
    var formData = new FormData();
    formData.set("index", index);
    formData.set("userId", props.id);
    formData.set("file", event.target.files[0]);
    const config = {
        headers: {
            'content-type': 'multipart/form-data',
        }
    }
    await Axios.post(`base/img/${props.id}`, formData, config)
  };

  async function handleOnDragEnd(result) {
    if (!result.destination) return;
    const items = Array.from(Items);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    UpdateItems(items);
    items.map((el, index) => {
      if (index === 0 && el.value !== "") {
        SetProfileImg(el.value);
      }
      return null;
    });
    await Axios.post(`base/img/dnd/${props.id}`, {index: result.source.index, id: result.destination.index})
  }

  return (
    <div className="App">
      <Grid container>
        <div style={{ overflowY: "scroll", height: "600px" }}>
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="items">
              {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                  {Items.map(({ id }, index) => {
                      return (
                          <Draggable
                          // isDragDisabled={isDD}
                          key={id}
                          draggableId={id}
                          index={index}
                          >
                        {(provided) => (
                            <div
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                            id={id + "img"}
                            className={classes.big}
                            onClick={() => {
                                triggerInput(index);
                            }}
                            >
                            <input
                            name="file"
                            // accept=".gif,.jpg,.jpeg,.png"
                              ref={addToRefs}
                              onChange={(e) => {
                                  handleChange(e, id, index);
                                }}
                                hidden
                                id={id}
                                type="file"
                                />
                            index:{index}-id:{id}
                            {provided.placeholder}
                            <IoMdAddCircle className={classes.addCircle} />
                          </div>
                        )}
                      </Draggable>
                    );
                })}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
        <div
          ref={ProfImgRef}
          style={{ width: "400px", height: "600px", border: "1px black solid" }}
          >
          Profile image
        </div>
      </Grid>
    </div>
  );
}

export default MyAddImages;