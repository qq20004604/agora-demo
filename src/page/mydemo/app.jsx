import React from 'react';
import ReactDOM from 'react-dom';
import 'common/css/reset.css';
import './style.scss';
import 'antd/dist/antd.css';
import $ajax from 'api/ajax.js';
import GLOBAL_VAR from 'common/config/variable'
import {Layout, Menu, Breadcrumb, notification} from 'antd';
import Login from 'component/login/login.jsx';

const {Header, Content, Footer} = Layout;

class Root extends React.Component {
    state = {
        logined: false
    };

    componentDidMount () {
    }

    render () {
        return <Layout>
            <Header style={{zIndex: 10, width: '100%'}}
                    id='header'>
                <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
                    <Menu.Item key="1">Agora DEMO</Menu.Item>
                </Menu>
            </Header>
            <Content style={{padding: '0 50px'}}>
                <Breadcrumb style={{margin: '16px 0'}}>
                    <Breadcrumb.Item>示例 DEMO</Breadcrumb.Item>
                    <Breadcrumb.Item>单对单</Breadcrumb.Item>
                </Breadcrumb>
                <div className="site-layout-content">
                    {
                        this.state.logined ? null : <Login login={this.login}/>
                    }
                </div>
            </Content>
            <Footer style={{textAlign: 'center'}}>开发人：零零水（QQ：20004604，微信：qq20004604）</Footer>
        </Layout>;
    }

    login = () => {
        this.setState({
            logined: true
        })
    }
}

ReactDOM.render(<Root/>,
    document.getElementById('root'));
