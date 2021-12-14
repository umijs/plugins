import { Spin } from "antd";
import React from "react";

export default function AntdLoader(props: { loading: boolean }) {
  const { loading } = props;
  if(!loading){
    return null;
  }
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        minHeight: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        maxHeight: "60vh",
      }}
    >
      <Spin spinning={loading} size="large" />
    </div>
  );
}
