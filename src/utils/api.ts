import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000', // 백엔드 URL
  timeout: 10000,
});

// 파일 가져오기 함수
export const getFile = async (
  year: string,
  month: string,
  location: string,
  fileName: string,
  type: 'image' | 'video'
): Promise<{ fileName: string; downloadUrl: string; type: string }> => {
  try {
    const expires = new Date().getTime().toString(); // URL 유효성 검증용
    const response = await api.get(
      `/storage/${year}/${month}/${location}/${fileName}`
    );
    console.log('response', response);
    return response.data;
  } catch (error) {
    console.error('Error fetching file:', error);
    throw error;
  }
};

export default api;
