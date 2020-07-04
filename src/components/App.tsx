import * as React from 'react'
import { hot } from 'react-hot-loader'

import './../assets/scss/App.scss'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'documents-editor': any
      'module-container': any
    }
  }
}

class App extends React.Component<{}, undefined> {
  public render() {
    return (
      <div>
        <h1>My Blog App</h1>
        <module-container>
          <documents-editor></documents-editor>
        </module-container>
      </div>
    )
  }
}

declare let module: object

export default hot(module)(App)
