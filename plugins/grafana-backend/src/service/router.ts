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
import { errorHandler } from '@backstage/backend-common';
import express, { Request, Response } from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
const { createProxyMiddleware, fixRequestBody, responseInterceptor } = require('http-proxy-middleware');
const parse = require('node-html-parser').parse;


export interface RouterOptions {
  logger: Logger;
}

export async function createRouter(
): Promise<express.Router> {

  const router = Router();

  router.use('/', createProxyMiddleware({ 
    target: 'http://127.0.0.1:3001', 
    selfHandleResponse: true,
    onProxyReq: fixRequestBody,
    onProxyRes: responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
      if(proxyRes.headers['content-type'] && proxyRes.headers['content-type'].includes("text/html")){
        const response = responseBuffer.toString('utf8');
        const html = parse(response)
        const head = html.querySelector('head');
        head.innerHTML = '<script>window.onmessage = function(e){if(e.data && e.data.timerange && e.data.timerange.from && e.data.timerange.to){angular.element("grafana-app").injector().get("timeSrv").setTime({from: e.data.timerange.from, to: e.data.timerange.to})}}</script>' + head.innerHTML;
        return html.toString();
      }
      return responseBuffer
    }),
  }));
  router.use(errorHandler());
  return router;
}



