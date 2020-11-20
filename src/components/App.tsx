import * as React from 'react';
import { ApolloClient } from 'apollo-boost';

import { ApolloClientModule } from '@uprtcl/graphql';

import { orchestrator } from '../index';

import './../assets/scss/App.scss';
import {
  EveesConfig,
  EveesHelpers,
  EveesInfoConfig,
  EveesModule,
  EveesRemote,
} from '@uprtcl/evees';
import { CortexModule, PatternRecognizer } from '@uprtcl/cortex';
import { TextType } from '@uprtcl/documents';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [x: string]: any;
    }
  }
}

interface IProps {}

interface IState {
  perspectiveId?: string;
}

class App extends React.Component<IProps, IState> {
  protected client!: ApolloClient<any>;
  protected remote!: EveesRemote;
  protected recognizer!: PatternRecognizer;

  constructor(props: IProps) {
    super(props);
    this.state = { perspectiveId: '' };
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
    this.client = orchestrator.container.get(
      ApolloClientModule.bindings.Client
    );
    this.recognizer = orchestrator.container.get(
      CortexModule.bindings.Recognizer
    );
    const remote = (orchestrator.container.get(
      EveesModule.bindings.Config
    ) as EveesConfig).defaultRemote;

    if (!remote) throw new Error('remote not found');
    this.remote = remote;

    let docId = localStorage.getItem('DOC_ID');

    if (docId) {
      this.setState((state) => ({ perspectiveId: docId }));
    } else {
      docId = await this.createDoc();
      localStorage.setItem('DOC_ID', docId);
    }
  }

  async createDoc() {
    const doc = {
      text: '',
      type: TextType.Title,
      links: [],
    };

    /** An Evee is made of a content-addressable object (this are called entities in _Prtcl) */
    const dataId = await EveesHelpers.createEntity(
      this.client,
      this.remote.store,
      doc
    );

    /** A commit object (also content-addressable) that points to that object */
    const headId = await EveesHelpers.createCommit(
      this.client,
      this.remote.store,
      {
        dataId,
      }
    );

    const randint = 0 + Math.floor((10000 - 0) * Math.random());

    /** And a mutable reference stored on a given EveesRemote */
    const perspectiveId = await EveesHelpers.createPerspective(
      this.client,
      this.remote,
      {
        headId,
        context: `my-test-${randint}`,
        canWrite: this.remote.userId,
      }
    );

    this.setState((state) => ({ perspectiveId }));

    return perspectiveId;
  }

  public render() {
    const eveesInfoConfig: EveesInfoConfig = {
      showDraftControl: true,
      showInfo: true,
      showIcon: true,
      checkOwner: true,
      isDraggable: true,
      showDebugInfo: true,
    };

    return (
      <div>
        <uprtcl-button onClick={() => this.createDoc()}>reset</uprtcl-button>
        {/* One module container component is needed as a wrapper above all Intercreativity's components.
            It exposes the micro-orchestrator container to the components. But you dont need to care about that. */}
        <module-container>
          <div className="editor">
            {/* The <documents-editor> web-component was registered by the DocumentsModule */}
            <documents-editor
              uref={this.state.perspectiveId}
              eveesInfoConfig={JSON.stringify(eveesInfoConfig)}
            ></documents-editor>
          </div>
        </module-container>
      </div>
    );
  }
}

export default App;
