import React from 'react';
import { Button, Table } from 'antd';
import { connect } from 'dva';
import { connectMaster } from 'umi';
@connect(({ user }) => ({ user }))
@connectMaster
export default class extends React.PureComponent {
  constructor(props) {
    super(props);
    const { dispatch } = props;
    dispatch({
      type: 'user/query',
    });
  }

  render() {
    const { user, current, pageSize } = this.props;
    const { list } = user;
    const columns = [
      {
        dataIndex: 'id',
        title: 'ID',
      },
      {
        dataIndex: 'name',
        title: 'Name',
      },
      {
        dataIndex: 'email',
        title: 'Email',
      },
    ];

    return (
      <div>
        <div>
          <h1>来自 app1 的数据</h1>
          <p>current: {current}</p>
          <p>pageSize: {pageSize}</p>
        </div>
        <Table rowKey="id" columns={columns} dataSource={list} />
      </div>
    );
  }
}
