import Head from "next/head";
import React from "react";
import { url } from "../func/url";

export default function MyHead() {
  return (
    <Head>
      <title>Shogi Online</title>
      <meta name="description" content="Shogi Online" />
      <link rel="icon" href={url("/favicon.ico")} />
      <meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no" />
    </Head>
  )
}