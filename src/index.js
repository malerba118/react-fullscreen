import React from "react";
import ReactDOM from "react-dom";
import Grid from "@material-ui/core/Grid";
import FullscreenDiv, { states } from "./Fullscreen";

import "./styles.css";

const App = () => {
  return (
    <Grid container>
      {[...Array(12).keys()].map(i => (
        <Grid item key={i} lg={4} md={6} xs={12}>
          <div className="grid-item">
            <FullscreenDiv className="fill-parent">
              {({ open, close, status }) => (
                <div className="fill-parent children-center img-container">
                  <img
                    onClick={() => {
                      if (
                        status === states.CLOSED ||
                        status === states.CLOSING
                      ) {
                        open();
                      }
                      if (status === states.OPEN || status === states.OPENING) {
                        close();
                      }
                    }}
                    src={`https://picsum.photos/id/${i * 10}/500/400`}
                    className="fill-parent img"
                    alt={i}
                  />
                </div>
              )}
            </FullscreenDiv>
          </div>
        </Grid>
      ))}
    </Grid>
  );
};

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
