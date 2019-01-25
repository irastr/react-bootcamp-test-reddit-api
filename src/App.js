import React, { Component } from "react";
import "./App.css";
import InputRange from "react-input-range";
import "react-input-range/lib/css/index.css";
import Loader from "react-loader-spinner";
import Card from "./components/Card";

class App extends Component {
  state = {
    data: [],
    isRefreshPressed: false,
    currentValue: 50,
    preloader: false
  };

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    this.updatePreloader(true);
    fetch("https://www.reddit.com/r/aww.json")
      .then(response => {
        if (response.status < 400) {
          return response.json();
        } else {
          throw response;
        }
      })
      .then(data => {
        this.updateSortedData(data);
        this.updatePreloader(false);
      })
      .catch(response => {
        response.json().then(error => {
          console.log(error);
        });
      });
  };

  updateSortedData = data => {
    this.setState({
      data: data.data.children.sort(
        (a, b) => b.data.num_comments - a.data.num_comments
      )
    });
  };

  handleRefreshClick = () => {
    this.setState(
      prevState => ({
        isRefreshPressed: !prevState.isRefreshPressed
      }),
      () => {
        this.state.isRefreshPressed
          ? (this.timerId = setInterval(() => {
              this.getData();
            }, 3000))
          : clearInterval(this.timerId);
      }
    );
  };

  filterData = () => {
    return this.state.data.filter(item => {
      return item.data.num_comments > this.state.currentValue;
    });
  };

  handleInputPangeChange = value => {
    this.setState({ currentValue: value });
  };

  updatePreloader = value => {
    this.setState({
      preloader: value
    });
  };

  render() {
    console.log(this.state.data);
    const { isRefreshPressed, preloader } = this.state;
    const filteredData = this.filterData();
    return (
      <div className="App">
        <h2 className="title">Top commented:</h2>
        <button className="button" onClick={this.handleRefreshClick}>
          {!isRefreshPressed ? "Start auto-refresh" : "Stop auto-refresh"}
        </button>
        <InputRange
          maxValue={1000}
          minValue={0}
          value={this.state.currentValue}
          onChange={value => this.handleInputPangeChange(value)}
          // onChangeComplete={value => this.handleInputPangeChange(value)}
        />
        {preloader ? (
          <Loader type="Puff" color="#047AFB" height="100" width="100" />
        ) : (
          <div className="cards-wrap">
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => {
                return (
                  <div className="card" key={index}>
                    <Card index={index} item={item} />
                  </div>
                );
              })
            ) : (
              <p className="nothing-found">Nothing found</p>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default App;
