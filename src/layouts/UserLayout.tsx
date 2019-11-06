import { DefaultFooter, MenuDataItem, getMenuData, getPageTitle } from '@ant-design/pro-layout';
import { Icon } from 'antd';
import DocumentTitle from 'react-document-title';
import Link from 'umi/link';
import React from 'react';
import { connect } from 'dva';
import SelectLang from '@/components/SelectLang';
import { ConnectProps, ConnectState } from '@/models/connect';
import logo from '../assets/logo.jpg';
import styles from './UserLayout.less';

export interface UserLayoutProps extends ConnectProps {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
}

const UserLayout: React.SFC<UserLayoutProps> = props => {
  const {
    route = {
      routes: [],
    },
  } = props;
  const { routes = [] } = route;
  const {
    children,
    location = {
      pathname: '',
    },
  } = props;
  const { breadcrumb } = getMenuData(routes);
  return (
    <DocumentTitle
      title={getPageTitle({
        pathname: location.pathname,
        breadcrumb,
        ...props,
      })}
    >
      <div className={styles.container}>
        <div className={styles.lang}>
          <SelectLang />
        </div>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="logo" className={styles.logo} src={logo} />
                <span className={styles.title}>AU-admin</span>
              </Link>
            </div>
            <div className={styles.desc}>管理系统</div>
          </div>
          {children}
        </div>
        <DefaultFooter
          copyright=" 2019 songten@icloud.com"
          links={[
            {
              key: 'AU-admin',
              title: 'AU-admin-typescript',
              href: 'https://github.com/songtianen/antd-typescript-admin',
              blankTarget: true,
            },
            {
              key: 'github',
              title: <Icon type="github" />,
              href: 'https://github.com/songtianen',
              blankTarget: true,
            }, // {
            //   key: 'Ant Design',
            //   title: 'Ant Design',
            //   href: 'https://ant.design',
            //   blankTarget: true,
            // },
          ]}
        />
      </div>
    </DocumentTitle>
  );
};

export default connect(({ settings }: ConnectState) => ({ ...settings }))(UserLayout);
