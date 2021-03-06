import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import packages from "packages";

export default class Success extends React.Component {
  static propTypes = {
    manifest: PropTypes.object.isRequired
  };

  render() {
    const id = (this.props.manifest || {}).name;

    return (
      <React.Fragment>
        <div className="section-subtitle">Installed</div>
        <div className="card mb-4">
          <div className="card-body">
            <p style={{ color: "#2fbcb2" }}>
              <strong>Success ✓</strong>
            </p>
            <Link
              style={{ color: "inherit", textDecoration: "inherit" }}
              to={"/" + packages.constants.NAME + "/" + id}
            >
              <button className="btn dappnode-background-color">
                GO TO PACKAGE
              </button>
            </Link>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
