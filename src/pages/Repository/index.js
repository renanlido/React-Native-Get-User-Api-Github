import React, { PureComponent } from 'react';
import propTypes from 'prop-types';
import { Browser, Loading } from './styles';

export default class Repository extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      repository: '',
    };
  }

  componentDidMount() {
    const { navigation } = this.props;

    const repository = navigation.getParam('repository');

    setTimeout(() => {
      this.setState({ repository, loading: false });
    }, 1000);
  }

  render() {
    const { repository, loading } = this.state;
    return (
      <>
        {loading ? (
          <Loading />
        ) : (
          <Browser source={{ uri: repository.html_url }} />
        )}
      </>
    );
  }
}

Repository.navigationOptions = ({ navigation }) => ({
  title: navigation.getParam('repository').name,
});

Repository.propTypes = {
  navigation: propTypes.shape({
    getParam: propTypes.func,
  }).isRequired,
};
