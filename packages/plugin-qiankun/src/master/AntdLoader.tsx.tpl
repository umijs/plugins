import { Spin } from "antd";
import React from "react";

export default function AntdLoader(props: { loading: boolean }) {
  const { loading } = props;
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
        display: loading ? '' : 'none',
      }}
    >
      <Spin spinning={loading} size="large" />
    </div>
  );
}
