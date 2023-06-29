/*
 * Copyright 2023 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import React from 'react';
import {
  useEntity,
} from '@backstage/plugin-catalog-react';
import { GrafanaChart, GrafanaDashboard } from '../GrafanaDashboard'
import moment from 'moment';

export function ExampleComponent() {
  
  const { entity } = useEntity();

  const grafanaUrl = "http://localhost:7007/api/grafana"

  const now = moment()

  const defaultTime = {
    from: now.toDate(),
    to: now.subtract(6, "hour").toDate(),
    raw: { from: "now - 6h", to: "now" }
  }

  const charts: GrafanaChart[] = [
    {
      dashboardId: "ea067e79-dedd-41a5-a178-98903c11c9cc",
      orgId: "1",
      panelId: "1",
      size: 6,
      vars: {
        app: entity.metadata.name
      }
    },
    {
      dashboardId: "ea067e79-dedd-41a5-a178-98903c11c9cc",
      orgId: "1",
      panelId: "2",
      size: 6,
      vars: {
        app: entity.metadata.name
      }
    },
  ]

  return <GrafanaDashboard grafanaUrl={grafanaUrl} charts={charts} defaultTime={defaultTime} />

}
