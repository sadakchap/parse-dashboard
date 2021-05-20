import React from "react";
import ReactDOMServer from "react-dom/server";
import DashboardView from "dashboard/DashboardView.react";
import Toolbar from "components/Toolbar/Toolbar.react";
import Fieldset from "components/Fieldset/Fieldset.react";
import styles from "dashboard/B4aConnectPage/B4aConnectPage.scss";
import LoaderContainer from "components/LoaderContainer/LoaderContainer.react";
import reactImg from './react.png';
import flutterImg from './flutter.png';
import androidImg from './android-robot.png'
import appleImg from './apple-logo.png';
import jsImg from './javascript-icon.png';
import graphQLImg from './graphQl.png';
import ionicImg from './ionic.png'
import xamarinImg from './xamarin-logo.png'

class B4aConnectPage extends DashboardView {
  constructor() {
    super();
    this.section = "API";
    this.subsection = 'Connect';
    this.state = {}
  }

  renderContent() {
    return (
      <LoaderContainer
        className={styles.loading}
        loading={false}
        hideAnimation={false}
        solid={true}
      >
        <div className={styles["connect-page"]}>
          <Toolbar section="Connect" />
          <Fieldset
            legend="Connect"
            description="Learn how to connect your app to your project chosen framework or API"
          >
            <div className={styles["frameworkList-container"]}>
              <a
                className={styles["framework-box"]}
                href="https://www.back4app.com/docs/react-native/parse-sdk/react-native-sdk"
                target="_blank"
              >
                <img src={reactImg} />
                <p>React Native</p>
              </a>
              <a
                className={styles["framework-box"]}
                href="https://www.back4app.com/docs/flutter/parse-sdk/parse-flutter-sdk"
                target="_blank"
              >
                <img src={flutterImg} />
                <p>Flutter</p>
              </a>
              <a
                className={styles["framework-box"]}
                href="https://www.back4app.com/docs/android/parse-android-sdk"
                target="_blank"
              >
                <img src={androidImg} />
                <p>Android</p>
              </a>
              <a
                className={styles["framework-box"]}
                href="https://www.back4app.com/docs/ios/parse-swift-sdk"
                target="_blank"
              >
                <img src={appleImg} />
                <p>IOS</p>
              </a>
              <a
                className={styles["framework-box"]}
                href="https://www.back4app.com/docs/javascript/parse-javascript-sdk"
                target="_blank"
              >
                <img src={jsImg} />
                <p>Javascript</p>
              </a>
              <a
                className={styles["framework-box"]}
                href="https://www.back4app.com/docs/parse-graphql/graphql-getting-started"
                target="_blank"
              >
                <img src={graphQLImg} />
                <p>GraphQL</p>
              </a>
              <a
                className={styles["framework-box"]}
                href="https://www.back4app.com/docs/js-framework/ionic/parse-ionic-sdk"
                target="_blank"
              >
                <img src={ionicImg} />
                <p>IONIC</p>
              </a>
              <a
                className={styles["framework-box"]}
                href="https://www.back4app.com/docs/xamarin/xamarin-templates"
                target="_blank"
              >
                <img src={xamarinImg} />
                <p>Xamarin</p>
              </a>
            </div>
          </Fieldset>
        </div>
      </LoaderContainer>
    );
  }
}

export default B4aConnectPage;
