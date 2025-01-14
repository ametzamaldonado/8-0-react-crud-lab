import React from "react";
import ShowListing from "./ShowListing";
import Show from "./Show";
import './ShowsIndex.css';
import Error from "../common/Error";

// Helper functions
import { getAllShows } from "../../api/fetch";
import { deleteShow } from "../../api/fetch";
import { Switch, Route, withRouter } from "react-router-dom";

class ShowsIndex extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shows: [],
      loadingError: false,
    };
  }

  componentDidMount() {
    getAllShows()
      .then((shows) => this.setState({ shows, loadingError: false }))
      .catch((error) => {
        console.error(error);
        this.setState({ loadingError: true });
      });
  }

  handleDelete = (e) => {
    const { value } = e.target;
    try {
      // console.log("we are deleting " + value);
      deleteShow(value);
      // do state here!
      const indToDelete = this.state.shows.findIndex(show => {
        return show.id === value
      }); //> returns the index num where the item exists at!
      const updatedShows = [...this.state.shows]; //> Creates copy  of array
      updatedShows.splice(indToDelete, 1) //> remove at index number 'index' and only delete '1' item.
      this.setState({
        shows:updatedShows
      });
      // how we do things in class components in v5
      this.props.history.push("/shows")
      // navigate("/shows") <--- version 6 way
    } catch(err) {
    console.log(err);
    this.setState({ loadingError: true });
  }
}

render() {
  if (this.state.loadingError) {
    return < Error />
  }
  return (
    <Switch>
      {/* The below route is for when we click on a specific show link! */}
      <Route path="/shows/:id">
        <Show shows={this.state.shows} handleDelete={this.handleDelete} />
      </Route>
      <section className="shows-index-wrapper">
        <h2>All Shows</h2>
        {/* <!-- ShowListing components --> */}
        <section className="shows-index">
          {this.state.shows.map((show) => {
            // console.log(show)
            return <ShowListing show={show} key={show.id} />
          })}
        </section>
      </section>
    </Switch>
  )
}
}

//> 'withRouter' gives us access to props
export default withRouter(ShowsIndex);

