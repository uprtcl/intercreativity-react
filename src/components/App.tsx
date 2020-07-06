import * as React from 'react'
import { hot } from 'react-hot-loader'
import { ApolloClient, gql } from 'apollo-boost'

import { ApolloClientModule } from '@uprtcl/graphql'

import { orchestrator } from '../index'

import './../assets/scss/App.scss'
import { EveesHelpers, EveesModule, EveesRemote } from '@uprtcl/evees'
import { CortexModule, PatternRecognizer } from '@uprtcl/cortex'
import { TextType } from '@uprtcl/documents'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'documents-editor': any
      'module-container': any
    }
  }
}

interface IProps {}

interface IState {
  perspectiveId?: string
}

class App extends React.Component<IProps, IState> {
  protected client!: ApolloClient<any>
  protected recognizer!: PatternRecognizer

  constructor(props: IProps) {
    super(props)
    this.state = { perspectiveId: '' }
  }

  async componentWillMount() {
    /**
     * We need to create a new Evee that will represent the document. We need some
     * services that we can get from the micro-orchestrator:
     *
     * - The client module is an GQL Apollo Client instance.
     * - The recognizer is used to recognize the type of our JSON object as a document.
     * - The remote is the HTTP EveesRemote service.
     *
     */
    this.client = orchestrator.container.get(ApolloClientModule.bindings.Client)
    this.recognizer = orchestrator.container.get(
      CortexModule.bindings.Recognizer,
    )
    const remote = orchestrator.container.get(
      EveesModule.bindings.DefaultRemote,
    ) as EveesRemote

    const doc = {
      text: '',
      type: TextType.Title,
      links: [],
    }

    /** An Evee is made of a content-addressable object (this are called entities in _Prtcl) */
    const dataId = await EveesHelpers.createEntity(this.client, remote, doc)

    /** A commit object (also content-addressable) that points to that object */
    const headId = await EveesHelpers.createCommit(this.client, remote, {
      dataId,
    })

    const randint = 0 + Math.floor((10000 - 0) * Math.random())

    /** And a mutable reference stored on a given EveesRemote */
    const perspectiveId = await EveesHelpers.createPerspective(
      this.client,
      remote,
      {
        headId,
        context: `my-test-${randint}`,
        canWrite: remote.userId,
      },
    )

    this.setState((state) => ({ perspectiveId }))

    console.log('Perspective created', perspectiveId)
  }

  public render() {
    return (
      <div>
        {/* One module container component is needed as a wrapper above all Intercreativity's components.
            It exposes the micro-orchestrator container to the components. But you dont need to care about that. */}
        <module-container>
          <div className="editor">
            {/* The <documents-editor> web-component was registered by the DocumentsModule */}
            <documents-editor
              uref={this.state.perspectiveId}
            ></documents-editor>
          </div>
        </module-container>
      </div>
    )
  }
}

declare let module: object

export default hot(module)(App)
