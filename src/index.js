import React from "react";
import ReactDOM from "react-dom";
import { Provider, connect } from "react-redux";
import { createStore } from "redux";

const initialState = {
  carList: [{ name: "Golf", color: "red" }, { name: "Polo", color: "blue" }],
  colorFilter: null
};

function reducers(state = initialState, action) {
  switch (action.type) {
    case "FILTER":
      return {
        ...state,
        colorFilter: action.payload
      };
    default:
      return state;
  }
}

const store = createStore(reducers);

export const carByColorSelector = (carList, color) => {
  return Boolean(color) === false
    ? carList
    : carList.filter(car => car.color.toLowerCase() === color.toLowerCase());
};

export const changeColorFilterAction = stateUpdater => event => {
  const data = event.target.value;
  stateUpdater(data);
};

function CarCatalogue(props) {
  const { title, carList, colorFilter, stateUpdater } = props;
  return (
    <fieldset>
      <legend>{title}</legend>
      <select onChange={changeColorFilterAction(stateUpdater)}>
        <option value="" />
        <option checked={colorFilter === "red"} value="red">
          red
        </option>
        <option checked={colorFilter === "blue"} value="blue">
          blue
        </option>
      </select>
      <ul>
        {carByColorSelector(carList, colorFilter).map(car => (
          <li key={car.name}>
            {car.name}, {car.color}
          </li>
        ))}
      </ul>
    </fieldset>
  );
}

class CarCatalogueContainer extends React.Component {
  state = {
    carList: [{ name: "Golf", color: "red" }, { name: "Polo", color: "blue" }],
    colorFilter: null
  };

  stateUpdater = data => {
    this.setState({
      colorFilter: data
    });
  };

  render() {
    const { carList, colorFilter } = this.state;
    return (
      <CarCatalogue
        title={"With Component State"}
        carList={carList}
        colorFilter={colorFilter}
        stateUpdater={this.stateUpdater}
      />
    );
  }
}

const mapStateToProps = state => ({
  title: "With Reducer",
  carList: state.carList,
  colorFilter: state.colorFilter
});

const mapDispatchToProps = dispatch => ({
  stateUpdater: payload =>
    dispatch({
      type: "FILTER",
      payload
    })
});

const CarCatalogueRedux = connect(
  mapStateToProps,
  mapDispatchToProps
)(CarCatalogue);

const CarCatalogueContext = React.createContext("CarCatalogueContext");

class CarCatalogueContainerForContextApi extends React.Component {
  state = {
    ...initialState,
    stateUpdater: data => {
      this.setState({
        colorFilter: data
      });
    }
  };
  render() {
    return (
      <CarCatalogueContext.Provider value={this.state}>
        <CarCatalogueContext.Consumer>
          {({ carList, colorFilter, stateUpdater }) => (
            <CarCatalogue
              title={"With Context Api"}
              carList={carList}
              colorFilter={colorFilter}
              stateUpdater={stateUpdater}
            />
          )}
        </CarCatalogueContext.Consumer>
      </CarCatalogueContext.Provider>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<CarCatalogueContainer />, rootElement);

const rootElement2 = document.getElementById("root2");
ReactDOM.render(
  <Provider store={store}>
    <CarCatalogueRedux />
  </Provider>,
  rootElement2
);

const rootElement3 = document.getElementById("root3");
ReactDOM.render(<CarCatalogueContainerForContextApi />, rootElement3);
