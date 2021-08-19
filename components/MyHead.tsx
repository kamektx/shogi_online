import Head from "next/head";
import React from "react";
import { url } from "../func/url";

export default function MyHead() {
  return (
    <Head>
      <title>Shogi Online</title>
      <meta name="description" content="Online Shogi Game." />
      <link rel="icon" href={url("/favicon.png")} />
      <meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no" />
      <meta property="og:title" content="Shogi Online" />
      <meta property="og:description" content="Online Shogi Game." />
      <meta property="og:image" content="https://techchair.net/shogi/shogi_online_ogp.png" />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="TechChair" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@kame15" />
    </Head>
  )
}