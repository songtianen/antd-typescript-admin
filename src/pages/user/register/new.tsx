import React from 'react';
import { Form, Input, Row, Col, Checkbox, Button, message } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { Dispatch } from 'redux';
import { StateType } from './model';
import { connect } from 'dva';
import router from 'umi/router';

import styles from './style.less';

interface RegisterProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  userAndregister: StateType;
  submitting: boolean;
}
interface RegisterState {
  count: number;
}

@connect(
  ({
    userAndregister,
    loading,
  }: {
    userAndregister: StateType;
    loading: {
      effects: {
        [key: string]: string;
      };
    };
  }) => ({
    userAndregister,
    submitting: loading.effects['userAndregister/submit'],
  }),
)
class RegistrationForm extends React.Component<RegisterProps, RegisterState> {
  state: RegisterState = {
    count: 0,
  };
  interval: number | undefined = undefined;

  componentDidUpdate() {
    const { userAndregister, form } = this.props;
    const account = form.getFieldValue('mail');

    if (userAndregister.statusCode === 200) {
      message.success('注册成功！');
      router.push({
        pathname: '/user/register/result',
        state: {
          account,
        },
      });
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  // 提交表单
  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'userAndregister/submit',
          payload: { ...values },
        });
        // if (userAndregister.statusCode === 200 && userAndregister.data['accessToken']) {
        // }
      }
    });
  };

  // 倒计时/获取验证码

  onGetCaptcha = () => {
    const { form, dispatch } = this.props;
    const phone = form.getFieldValue('phone');
    if (phone === undefined || phone.trim() === '') {
      message.error('请输入手机号！');
      return;
    }
    let count = 59;
    this.setState({
      count,
    });
    this.interval = window.setInterval(() => {
      count -= 1;
      this.setState({
        count,
      });

      if (count === 0) {
        clearInterval(this.interval);
      }
    }, 1000);
    dispatch({
      type: 'userAndregister/getCapcha',
      payload: { phone },
    });
  };

  render() {
    const { count } = this.state;
    const { form, submitting, userAndregister } = this.props;
    const statusCode = userAndregister.statusCode || '';
    const msg = userAndregister.msg || '';
    const data = userAndregister.data || '';
    const isArrData = Array.isArray(data);
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };

    return (
      <div className={styles.main}>
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <Form.Item
            validateStatus={
              statusCode === 500 && (isArrData && data.indexOf('username') > -1) ? 'error' : ''
            }
            help={
              statusCode === 500 && (isArrData && data.indexOf('username') > -1)
                ? `${msg}username`
                : ''
            }
            label={<span>用户名&nbsp;</span>}
          >
            {getFieldDecorator('username', {})(<Input />)}
          </Form.Item>
          <Form.Item
            validateStatus={
              statusCode === 500 && (isArrData && data.indexOf('email') > -1) ? 'error' : ''
            }
            help={
              statusCode === 500 && (isArrData && data.indexOf('email') > -1) ? `${msg}email` : ''
            }
            label="E-mail"
          >
            {getFieldDecorator('email', {})(<Input />)}
          </Form.Item>
          <Form.Item
            validateStatus={
              statusCode === 500 && (isArrData && data.indexOf('password') > -1) ? 'error' : ''
            }
            help={
              statusCode === 500 && (isArrData && data.indexOf('password') > -1)
                ? `${msg}password`
                : ''
            }
            label="密码"
            hasFeedback
          >
            {getFieldDecorator('password', {})(<Input.Password />)}
          </Form.Item>
          <Form.Item
            validateStatus={
              statusCode === 500 && (isArrData && data.indexOf('confirm') > -1) ? 'error' : ''
            }
            help={
              statusCode === 500 && (isArrData && data.indexOf('confirm') > -1)
                ? `${msg}confirm`
                : ''
            }
            label="确认密码"
            hasFeedback
          >
            {getFieldDecorator('confirm', {})(<Input.Password />)}
          </Form.Item>
          <Form.Item
            validateStatus={
              statusCode === 500 && (isArrData && data.indexOf('phone') > -1) ? 'error' : ''
            }
            help={
              statusCode === 500 && (isArrData && data.indexOf('phone') > -1) ? `${msg}phone` : ''
            }
            label="手机号"
          >
            {getFieldDecorator('phone', {})(<Input addonBefore={null} style={{ width: '100%' }} />)}
          </Form.Item>
          <Form.Item
            validateStatus={
              statusCode === 500 && (isArrData && data.indexOf('captcha') > -1) ? 'error' : ''
            }
            help={
              statusCode === 500 && (isArrData && data.indexOf('captcha') > -1)
                ? `${msg}captcha`
                : ''
            }
            label="验证码"
            extra="We must make sure that your are a human."
          >
            <Row gutter={8}>
              <Col span={12}>{getFieldDecorator('captcha', {})(<Input />)}</Col>
              <Col span={12}>
                <Button disabled={!!count} onClick={this.onGetCaptcha}>
                  {count ? `${count} s` : '获取验证码'}
                </Button>
              </Col>
            </Row>
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            {getFieldDecorator('agreement', {
              valuePropName: 'checked',
            })(
              <Checkbox>
                I have read the <a href="">agreement</a>
              </Checkbox>,
            )}
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Button loading={submitting} type="primary" htmlType="submit">
              提交注册
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default Form.create<RegisterProps>({ name: 'register' })(RegistrationForm);
