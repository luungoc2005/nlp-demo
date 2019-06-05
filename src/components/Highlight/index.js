import React from 'react';
import { Tooltip } from 'antd';

export const Highlight = ({ children, description, tooltip }) => 
<Tooltip title={tooltip || description}>
  <span style={{
    border: '1px solid #e8e8e8',
    borderRadius: '2px',
    marginLeft: 5,
    marginRight: 5,
    display: 'flex',
    flexDirection: 'column',
    // marginTop: -10
  }}>
    <span style={{ padding: 10, backgroundColor: 'white' }}>{children}</span>
    <span style={{
      backgroundColor: 'rgba(0,0,0,0.45)',
      color: 'white',
      textAlign: 'center',
    }}>{description}</span>
  </span>
</Tooltip>

export default Highlight;