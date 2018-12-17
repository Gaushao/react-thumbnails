import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { createStore } from 'redux'

const initialState = {
  images : [
    {
      src: "img/beef-steak-2210x1473.jpg",
      votes:0
    },
    {
      src: "img/country-bread-serving-2210x1473.jpg",
      votes:0
    },
    {
      src: "img/fresh-and-healthy_free_stock_photos_picjumbo_IMG_6387-2210x1473.jpg",
      votes:0
    },
    {
      src: "img/fresh-healthy-breakfast-in-heart-shaped-bowl-2210x1475.jpg",
      votes:0
    },
    {
      src: "img/fresh-healthy-morning-breakfast-2210x1473.jpg",
      votes:0
    },
    {
      src: "img/morning-breakfast-2210x1473.jpg",
      votes:0
    },
    {
      src: "img/sweet-morning-breakfast-2210x1473.jpg",
      votes:0
    },
    {
      src: "img/young-woman-enjoying-morning-breakfast-in-bed-2-2210x1475.jpg",
      votes:0
    },
    {
      src: "img/young-woman-with-her-morning-fresh-healthy-breakfast-2210x1474.jpg",
      votes:0
    },
  ]
};

function reducer(state = initialState, action){
  switch(action.type){
      case 'LIKE':
        state = {
          ...state
        };
        state.images[action.id].votes++;
      break;
      case 'DISLIKE':
      state = {
        ...state
      };
      state.images[action.id].votes--;
      break;
      case 'COMPARE':
        state = {
          ...state,
          images: action.images.sort((a,b) => {
            if (a.votes > b.votes)
              return -1;
            if (a.votes < b.votes)
              return 1;
            return 0;
          })
        };
      break;
  }
  return state;
}

const store = createStore(reducer);

class Picture extends Component {
  constructor(props){
    super(props);
    this.state = {
      id: props.id,
      src: store.getState().images[props.id].src
    };
    store.subscribe(()=>{
      this.setState({ id: this.state.id, src: store.getState().images[this.state.id].src});
    });
  }
  toThumb({target:img}){
      //Ratio calculation not needed (?)
      let size = 100;
      if(img.offsetWidth >= img.offsetHeight){img.width = size;}
      else{img.height = size;}
  }
  render() {
    return (
      <img src={this.state.src} onLoad={this.toThumb.bind(this)} />
      );
  }
}
class Like extends Component {
  constructor(props){
    super(props);
    this.state = {
      id: props.id
    };
  }
  render(){
    return (
      <button onClick={() => {
        store.dispatch({type:'LIKE', id : this.state.id});
        store.dispatch({type:'COMPARE', images : store.getState().images});
      }}>Like</button>
    );
  }
}
class Dislike extends Component {
  constructor(props){
    super(props);
    this.state = {
      id: props.id
    };
  }
  render(){
    return (
      <button onClick={() => {
        store.dispatch({type:'DISLIKE', id : this.state.id});
        store.dispatch({type:'COMPARE', images : store.getState().images});
      }}>Dislike</button>
    );
  }
}
class Rate extends Component {
  constructor(props){
    super(props);
    this.state = {
      id: props.id,
      votes: store.getState().images[props.id].votes
    };
    store.subscribe(()=>{
      this.setState({ id: this.state.id, votes: store.getState().images[this.state.id].votes});
    });
  }
  render(){
    return (
      <div>
        <Like id={this.state.id} />
        {this.state.votes}
        <Dislike id={this.state.id} />
      </div>
    );
  }
}
class Thumb extends Component {
  constructor(props){
    super(props);
    this.id = props.id;
  }
  render() {
    return (
    <div>
      <Picture id={this.id} /><Rate id={this.id} />
    </div>);
  }
}
class App extends Component {
  constructor(){
    super();
    this.tags = [];
    for(let i in store.getState().images){
      this.tags.push(<Thumb id={i} />);
    }
  }
  render() {
    return (
      this.tags
    );
  }
}

export default App;
