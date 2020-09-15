import React from 'react';
import ReactDOM from 'react-dom';
import 'common/css/reset.css';
import './style.scss';
import 'antd/dist/antd.css';
import $ajax from 'api/ajax.js';
import GLOBAL_VAR from 'common/config/variable'
import {Layout, Menu, Breadcrumb, notification} from 'antd';

const {Header, Footer} = Layout;

class Root extends React.Component {
    state = {
    };

    componentDidMount() {
    }

    render() {
        return <Layout>
            <Header style={{position: 'fixed', zIndex: 10, width: '100%'}}
                    id='header'>
            </Header>
            <Footer style={{textAlign: 'center'}}>开发人：零零水（QQ：20004604，微信：qq20004604）</Footer>
        </Layout>;
    }
}

ReactDOM.render(<Root/>,
    document.getElementById('root'));
