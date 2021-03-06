import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import * as action from "../actions";
import { createStructuredSelector } from "reselect";
import * as selector from "../selectors";
import * as utils from "../utils";
import { NAME } from "../constants";
import { push } from "connected-react-router";
// Components
import TypeFilter from "./TypeFilter";
import PackageStore from "./PackageStore";
// Modules
import chains from "chains";
// Styles
import "./installer.css";
import { select } from "redux-saga/effects";

class InstallerView extends React.Component {
  static propTypes = {
    // State -> props
    directory: PropTypes.array.isRequired,
    selectedTypes: PropTypes.array.isRequired,
    inputValue: PropTypes.string.isRequired,
    fetching: PropTypes.bool.isRequired,
    // Dispatch -> props
    openPackage: PropTypes.func.isRequired,
    updateInput: PropTypes.func.isRequired,
    updateSelectedTypes: PropTypes.func.isRequired
  };

  render() {
    return (
      <div>
        <div className="section-title">Installer</div>

        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Enter package's name or IPFS hash"
            aria-label="Package name"
            aria-describedby="basic-addon2"
            value={this.props.inputValue}
            onChange={this.props.updateInput}
            onKeyDown={e => {
              const key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
              if (key === 13) this.props.openPackage(this.props.inputValue);
            }}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={() => this.props.openPackage(this.props.inputValue)}
            >
              Install
            </button>
          </div>
        </div>

        <TypeFilter
          directory={this.props.directory}
          selectedTypes={this.props.selectedTypes}
          updateSelectedTypes={this.props.updateSelectedTypes}
        />

        <chains.components.ChainStatusLog />

        <PackageStore
          fetching={this.props.fetching}
          directory={this.props.directory}
          openPackage={this.props.openPackage}
          isSyncing={this.props.isSyncing}
        />
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  directory: selector.getFilteredDirectoryNonCores,
  selectedTypes: selector.getSelectedTypes,
  inputValue: selector.getInput,
  fetching: selector.fetching,
  isSyncing: selector.isSyncing
});

const mapDispatchToProps = dispatch => {
  return {
    openPackage: id => {
      const url = utils.idToUrl(id);
      dispatch(push("/" + NAME + "/" + url));
      // Dispatch a fetch anyway
      dispatch(action.fetchPackageData(id));
      // Empty the input bar
      dispatch(action.updateInput(""));
    },

    updateInput: e => {
      // Correct the ipfs format and fecth if correct
      const id = utils.correctPackageName(e.target.value);
      // If the packageLink is a valid IPFS hash preload it's info
      if (utils.isIpfsHash(id)) {
        dispatch(action.fetchPackageData(id));
      }
      if (utils.isDnpDomain(id)) {
        dispatch(action.fetchPackageData(id));
      }
      // Update input field
      dispatch(action.updateInput(id));
    },

    updateSelectedTypes: types => {
      dispatch(action.updateSelectedTypes(types));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InstallerView);
