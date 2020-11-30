import * as React from 'react';
import { render } from 'react-dom';
import App from './components/App';
import * as IPFS from 'ipfs';

import { Auth0ClientOptions } from '@auth0/auth0-spa-js';

import { EveesHttp, EveesHttpModule } from '@uprtcl/evees-http';
import { EveesEthereumWrapper } from '@uprtcl/evees-ethereum';

import { HttpStore, HttpAuth0Provider } from '@uprtcl/http-provider';

import {
  MicroOrchestrator,
  i18nextBaseModule,
} from '@uprtcl/micro-orchestrator';
import { LensesModule } from '@uprtcl/lenses';
import { DocumentsModule } from '@uprtcl/documents';
import { EveesConfig, EveesModule, EveesRemote } from '@uprtcl/evees';
import { CortexModule } from '@uprtcl/cortex';
import { ApolloClientModule } from '@uprtcl/graphql';
import { DiscoveryModule } from '@uprtcl/multiplatform';

import { QuantityModule } from './module/quantity.module';
import { customBlocks } from './customBlocks';

import { env } from './env';

export let orchestrator = new MicroOrchestrator();

(async function () {
  /**
   * We are registering an HTTP EveesProvider which will be the place where our content
   * will be stored. You can register more than one provider to have a multi-platform application.
   *
   * The micro-orchestor will also load the custom-elements of each module, so they can be used in your app.
   */
  // const c1host = 'https://api.intercreativity.io/uprtcl/1';
  const c1host = 'http://localhost:3100/uprtcl/1';

  const httpCidConfig: any = {
    version: 1,
    type: 'sha3-256',
    codec: 'raw',
    base: 'base58btc',
  };

  const auth0Config: Auth0ClientOptions = {
    domain: 'linked-thoughts-dev.eu.auth0.com',
    client_id: 'I7cwQfbSOm9zzU29Lt0Z3TjQsdB6GVEf',
    redirect_uri: `${window.location.origin}/homeBLYAT`,
    cacheLocation: 'localstorage',
  };

  const httpProvider = new HttpAuth0Provider(
    { host: c1host, apiId: 'evees-v1' },
    auth0Config
  );
  const httpStore = new HttpStore(httpProvider, httpCidConfig);
  const httpEvees = new EveesHttp(httpProvider, httpStore);

  const ipfsJSConfig = {
    preload: { enabled: false },
    relay: { enabled: true, hop: { enabled: true, active: true } },
    EXPERIMENTAL: { pubsub: true },
    config: {
      init: true,
      Addresses: {
        Swarm: env.pinner.Swarm,
      },
      Bootstrap: env.pinner.Bootstrap,
    },
  };

  const ipfs = await IPFS.create(ipfsJSConfig);

  const ethWrapper = new EveesEthereumWrapper(
    ipfs,
    env.ethers.provider,
    env.pinner
  );
  await ethWrapper.load();

  const remotes: EveesRemote[] = [httpEvees];
  remotes.push(...ethWrapper.remotes);

  // const polkadotWrapper = new EveesPolkadotWrapper(ipfs, env.pinner);
  // await polkadotWrapper.load();
  // remotes.push(...polkadotWrapper.remotes);

  const config: EveesConfig = {
    defaultRemote: httpEvees,
    officialRemote: httpEvees,
  };

  const evees = new EveesModule(remotes, config);

  const documents = new DocumentsModule(customBlocks);

  const modules = [
    new i18nextBaseModule(),
    new ApolloClientModule(),
    new CortexModule(),
    new DiscoveryModule([httpEvees.casID]),
    new LensesModule(),
    new EveesHttpModule(),
    new QuantityModule(),
    evees,
    documents,
  ];

  await orchestrator.loadModules(modules);

  await httpEvees.connect();
  await httpEvees.login();

  const rootEl = document.getElementById('root');

  render(<App />, rootEl);
})();
