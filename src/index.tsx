import * as React from 'react'
import { render } from 'react-dom'
import App from './components/App'

import {
  MicroOrchestrator,
  i18nextBaseModule,
} from '@uprtcl/micro-orchestrator'
import { LensesModule } from '@uprtcl/lenses'
import { DocumentsModule } from '@uprtcl/documents'

import { CortexModule } from '@uprtcl/cortex'
import { AccessControlModule } from '@uprtcl/access-control'
import { EveesModule, EveesHttp } from '@uprtcl/evees'

import { HttpConnection } from '@uprtcl/http-provider'

import { EthereumConnection } from '@uprtcl/ethereum-provider'

import { ApolloClientModule } from '@uprtcl/graphql'
import { DiscoveryModule, CidConfig } from '@uprtcl/multiplatform'

export let orchestrator: MicroOrchestrator

  /**
   * Intercreativity is build on top of _Prtcl and works with a dependency injection
   * paradigm around a micro-orchestor (container of all the dependencies of the app).
   *
   * This is how it works:
   *
   * - You initalize the modules and put them inside the container.
   * - You then use these modules anywhere in your app.
   *
   */
;(async function () {
  /**
   * We are registering an HTTP EveesProvider which will be the place where our content
   * will be stored. You can register more than one provider to have a multi-platform application.
   *
   * The micro-orchestor will also load the custom-elements of each module, so they can be used in your app.
   */
  const host = 'https://api.intercreativity.io/uprtcl/1'
  //const host = 'http://localhost:3100/uprtcl/1'

  const httpCidConfig: CidConfig = {
    version: 1,
    type: 'sha3-256',
    codec: 'raw',
    base: 'base58btc',
  }

  orchestrator = new MicroOrchestrator()

  const httpConnection = new HttpConnection()
  const ethConnection = new EthereumConnection({ provider: '' })

  const httpEvees = new EveesHttp(
    host,
    httpConnection,
    ethConnection,
    httpCidConfig,
  )

  const evees = new EveesModule([httpEvees], httpEvees)

  const documents = new DocumentsModule()

  const modules = [
    new i18nextBaseModule(),
    new ApolloClientModule(),
    new CortexModule(),
    new DiscoveryModule([httpEvees.casID]),
    new LensesModule(),
    new AccessControlModule(),
    evees,
    documents,
  ]

  await orchestrator.loadModules(modules)

  await httpEvees.connect()
  await httpEvees.login()

  const rootEl = document.getElementById('root')

  render(<App />, rootEl)
})()
