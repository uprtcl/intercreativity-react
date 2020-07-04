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

import { HttpConnection, HttpStore } from '@uprtcl/http-provider'

import { EthereumConnection } from '@uprtcl/ethereum-provider'

import { ApolloClientModule } from '@uprtcl/graphql'
import { DiscoveryModule, CidConfig } from '@uprtcl/multiplatform'
;(async function () {
  const host = 'http://api.intercreativity.io/uprtcl/1'
  const httpCidConfig: CidConfig = {
    version: 1,
    type: 'sha3-256',
    codec: 'raw',
    base: 'base58btc',
  }

  const orchestrator = new MicroOrchestrator()

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
})()

const rootEl = document.getElementById('root')

render(<App />, rootEl)
