import api from '@/api'; // 인터셉터가 적용된 axios 인스턴스

const BASE_URL = '/api';

// 토큰에서 user_no 추출 (Number 타입 반환 - Long 대응)
function getUserNoFromToken() {
  const auth = localStorage.getItem('auth');
  if (!auth) return 0;
  const parsedAuth = JSON.parse(auth);
  const user_no = Number(parsedAuth.user.userNo || parsedAuth.user.user_no || 0);
  console.log('userNo:', user_no);
  return user_no;
}

export default {
  async follow(to_user_no, isFollowing) {
    console.log(isFollowing);
    const user_no = getUserNoFromToken(); // 토큰에서 user_no 추출

    const followDTO = {
      from_user_no: user_no,
      to_user_no: to_user_no,
    };

    try {
      if (isFollowing) {
        const { data } = await api.delete(`${BASE_URL}/unfollow`, {
          data: followDTO,
        });
        console.log('Unfollowed successfully:', data);
        return data;
      } else {
        const { data } = await api.post(`${BASE_URL}/follow`, followDTO);
        console.log('Followed successfully:', data);
        return data;
      }
    } catch (error) {
      console.error('Error in follow/unfollow:', error.response || error);
      throw error;
    }
  },
  async getFollowingList() {
    const user_no = getUserNoFromToken();
    try {
      const { data } = await api.get(`${BASE_URL}/follow/following/${user_no}`);
      console.log('Following List:', data);
      return data;
    } catch (error) {
      console.error('Error fetching following list:', error.response || error);
      throw error;
    }
  },

  async getFollowerList() {
    const user_no = getUserNoFromToken();
    try {
      const { data } = await api.get(`${BASE_URL}/follow/followers/${user_no}`);
      console.log('Follower List:', data);
      return data;
    } catch (error) {
      console.error('Error fetching follower list:', error.response || error);
      throw error;
    }
  },
};