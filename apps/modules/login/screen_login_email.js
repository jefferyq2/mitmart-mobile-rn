'use strict';

import {
  Dimensions,
  StyleSheet,
  Text,
  Image,
  View,
  TextInput,
  ToastAndroid,
  Alert,
  TouchableOpacity
} from 'react-native';

import React, {
  Component
} from 'react';

import Styles from './style_login';
import AsyncStorage from '../../async_storage/async_storage';
import Url from '../../app_config';
import Network from '../../helpers/network_helper';
var post = new Network.Post();
var {height, width} = Dimensions.get('window');

class LoginScreenEmail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };
  }

  validation(username, password) {
    if (!username && !password) {
      Alert.alert('Login Failed', 'Username and Password required!');
    } else if (!username.trim()) {
      Alert.alert('Login Failed', 'Username is required!');
    } else if (!password.trim()) {
      Alert.alert('Login Failed', 'Password is required!');
    } else {
      this.signin(username, password);
    }
  }

  signin(username, password) {
    const req = JSON.stringify({ username: username, password: password });
    post.getData(Url.LOGIN_URL, req)
      .then((data) => {
        if (data.id) {
          //move async storage code to home & merchant wizard screen
          if (data.id && (data.isWizardCompleted === undefined || data.isWizardCompleted === true)) {
            AsyncStorage.setUserInfo(username, data.id, data.ttl, data.created, data.userId);
          }
          return data;
        } else if (data.error) {
          Alert.alert('Login Failed', data.error.message);
          return data.error;
        }
      })
      .then((data) => {
        if (data.id && (data.isWizardCompleted === undefined || data.isWizardCompleted === true)) {
          this.props.navigator.resetTo({
            id: 'HomeScreen',
            username: username,
            loginId: data.id,
            userId: data.userId,
            data: data
          });
        } else if (data.id && data.isWizardCompleted === false) {
          Alert.alert('Merchant Wizard', 'Merchant Wizard');
        } else {
          Alert.alert('Login Failed', data.error.message);
        }
      })
      .catch(error => {
        console.log(`[Error] - Sign in attempt is failing. Error: ${JSON.stringify(error)}`);
      })
      .done();
  }

  goToResetScreen() {
    this.props.navigator.push({
      id: 'ResetScreen',
    });
  }

  render() {
    return (
      <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <View style={Styles.bgImageWrapper}>
          <Image
            source={require('../../resources/bg_image.jpg') }
            style={Styles.bgImage} />
        </View>
        <View style={Styles.containerTop}>
          <Image
            style = {{ height: 200, width: 300, alignSelf: 'stretch' }}
            source={require('../../resources/mitmart_logo.png') }
            resizeMode='contain' />
        </View>
        <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <View style={Styles.container}>
            <View style={Styles.containerCenter}>
              <Image
                style = {Styles.image}
                source={require('../../resources/ic_messages.png') }/>
              <TextInput
                ref = 'username'
                style={Styles.inputText2}
                placeholder={`Username`}
                onChangeText={(username) => this.setState({ username }) } />
            </View>
            <View style={Styles.containerCenter}>
              <Image
                style = {Styles.image}
                source={require('../../resources/ic_lock_large.png') }/>
              <TextInput
                ref='password'
                style={Styles.inputText2}
                placeholder={`Password`}
                onChangeText={(password) => this.setState({ password }) }
                secureTextEntry= {true} />
            </View>
            <TouchableOpacity
              onPress={() => this.validation(this.state.username, this.state.password) }
              style={[Styles.buttonBase, Styles.buttonPosCenter]}>
              <View >
                <Text style={Styles.simpleButtonText}> Login</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={Styles.containerReset}>
            <Text
              style={Styles.textForgot}>
              {'Forgot password, '}
            </Text>
            <Text
              style={Styles.textReset}
              onPress={() => this.goToResetScreen() } >
              {'reset now!'}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  onPressReset() {
    Alert.alert('Reset', 'Are you sure want to reset your password?');
  }
}

module.exports = LoginScreenEmail;