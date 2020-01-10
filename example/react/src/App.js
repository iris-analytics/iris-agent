import React, { Fragment, useEffect, useCallback } from 'react';
import Iris from 'iris';

const App = () => {
  useEffect(() => {
    // Init the Iris instance
    Iris.init('XXX-ACCOUNT', { targetUrl: "http://iris-backend/recordevent.gif", cookiePrefix: "_ir" });
    // Fire pageload event
    Iris.fire('pageload', { "foo": 1 });
  });

  const handleButtonClick = useCallback(() => {
    Iris.fire('button-click');
  }, []);

  const handleLinkClick = useCallback(() => {
    Iris.fire('link-click');
  }, []);

  const handleImageClick = useCallback(() => {
    Iris.fire('image-click');
  }, []);


  return (
    <Fragment>
      <section className="section">
        <div className="container">
          <h1 className="title">
            Hi there!
          </h1>
          <p className="subtitle">
            We will test tracking events with <strong>iris agent</strong>!
          </p>
        </div>
      </section>

      <div className="container">
        <div className="notification">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Lobortis scelerisque fermentum dui faucibus in ornare quam.
        </div>
      </div>

      <hr />
      <div className="container">
        <div className="columns">
          <div className="column">
            Interdum velit euismod in pellentesque massa placerat duis ultricies lacus. Sollicitudin nibh sit amet commodo
            nulla. Purus semper eget duis at tellus at urna. Pellentesque elit ullamcorper dignissim cras tincidunt lobortis
            feugiat. Lorem mollis aliquam ut porttitor leo a diam. <a href="#">Tincidunt praesent semper feugiat</a> nibh
            sed pulvinar.
            Aliquet enim tortor at auctor. Lacinia quis vel eros donec ac. Pellentesque sit amet porttitor eget dolor morbi.
            Commodo odio aenean sed adipiscing diam. Imperdiet proin fermentum <strong>leo vel orci porta non</strong>.
            Semper eget duis at
            tellus at urna condimentum. Sed euismod nisi porta lorem mollis aliquam.

          </div>
          <div className="column">
            <div className="card">
              <div className="card-image">
                <figure className="image is-4by3">
                  <img src="http://via.placeholder.com/1280" alt="Image 1 to be tracked!" onClick={handleImageClick} />
                </figure>
              </div>
              <div className="card-content">
                <div className="media">
                  <div className="media-left">
                    <figure className="image is-48x48">
                      <img src="http://via.placeholder.com/96" alt="Image 2 to be tracked!" onClick={handleImageClick} />
                    </figure>
                  </div>
                  <div className="media-content">
                    <p className="title is-4">John Smith</p>
                    <p className="subtitle is-6">@johnsmith</p>
                  </div>
                </div>

                <div className="content">
                  Quisque non tellus orci ac auctor augue mauris augue. <a>@iris</a>.
                  <a onClick={handleLinkClick}>#css</a> <a onClick={handleLinkClick}>#responsive</a>
                  <br />
                    <time dateTime="2016-1-1">11:09 PM - 1 Jan 2016</time>
                </div>
              </div>
            </div>
          </div>
          <div className="column">
            <p>Vel elit scelerisque mauris pellentesque pulvinar pellentesque habitant morbi. Gravida dictum fusce ut
              placerat orci nulla. Bibendum neque egestas congue quisque egestas diam in arcu cursus. Bibendum at varius vel
              pharetra vel turpis.</p>
            <hr />
            <div className="buttons">
              <button className="button" onClick={handleButtonClick}>Very important button!</button>
            </div>
          </div>
          <div className="column">
            <div className="card">
              <div className="card-content">
                <p className="title">
                  Libero id faucibus nisl tincidunt eget nullam. Feugiat in fermentum posuere urna.
                </p>

              </div>
              <footer className="card-footer">
                <p className="card-footer-item">
              <span>
                View on <a onClick={handleLinkClick}>Twitter</a>
              </span>
                </p>
                <p className="card-footer-item">
                  <span>
                    Share on <a onClick={handleLinkClick}>Facebook</a>
                  </span>
                </p>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default App;
