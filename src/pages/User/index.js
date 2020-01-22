import React, { PureComponent } from 'react';
import propTypes from 'prop-types';
import api from '../../services/api';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
  Loading,
  LoadStars,
} from './styles';

export default class User extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      stars: [],
      loading: true,
      disabled: true,
      page: 1,
      refreshing: false,
    };
  }

  async componentDidMount() {
    this.load();
  }

  load = async (page = 1) => {
    const { stars, disabled } = this.state;
    const { navigation } = this.props;

    if (!disabled) {
      this.setState({ disabled: true });
    }

    const user = navigation.getParam('user');

    const response = await api.get(`/users/${user.login}/starred`, {
      params: { page },
    });

    this.setState({
      stars: page >= 2 ? [...stars, ...response.data] : response.data,
      page,
      loading: false,
      disabled: false,
      refreshing: false,
    });
  };

  refreshList = () => {
    this.setState({ refreshing: true, stars: [] }, this.load);
  };

  loadMore = () => {
    const { page } = this.state;

    const nextPage = page + 1;

    this.load(nextPage);
  };

  handleNavigate = repository => {
    const { navigation } = this.props;

    navigation.navigate('Repository', { repository });
  };

  render() {
    const { stars, loading, refreshing, disabled } = this.state;
    const { navigation } = this.props;
    const user = navigation.getParam('user');

    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>
        {loading ? (
          <Loading />
        ) : (
          <>
            {disabled && <LoadStars />}
            <Stars
              data={stars}
              onRefresh={() => this.refreshList()}
              refreshing={refreshing}
              onEndReachedThreshold={0.2}
              onEndReached={() => this.loadMore()}
              keyExtractor={star => String(star.id)}
              renderItem={({ item }) => (
                <Starred onPress={() => this.handleNavigate(item)}>
                  <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                  <Info>
                    <Title>{item.name}</Title>
                    <Author>{item.owner.login}</Author>
                  </Info>
                </Starred>
              )}
            />
          </>
        )}
      </Container>
    );
  }
}

User.navigationOptions = ({ navigation }) => ({
  title: navigation.getParam('user').name,
});

User.propTypes = {
  navigation: propTypes.shape({
    getParam: propTypes.func,
    navigate: propTypes.func,
  }).isRequired,
};
