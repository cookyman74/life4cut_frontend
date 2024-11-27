import React, { useEffect, useState } from 'react';
import { useLocation as useReactLocation } from 'react-router-dom';
import { getFile } from '../utils/api';

const Editor: React.FC = () => {
  const url_location = useReactLocation();
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<'image' | 'video' | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFile = async () => {
      try {
        const pathParts = url_location.pathname.split('/').slice(1); // URL 경로 분리
        const [year, month, location, fileName] = pathParts;

        // // URL에서 'type' 파라미터 가져오기
        // const type = new URLSearchParams(url_location.search).get('type');
        //
        // // 타입 검증
        // if (type === 'image' || type === 'video') {
        //   setFileType(type); // 타입이 유효하면 설정
        // } else {
        //   throw new Error('Invalid file type');
        // }

        // API 호출
        const { downloadUrl } = await getFile(year, month, location, fileName, 'image');

        setFileUrl(downloadUrl); // 다운로드 URL 설정
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching file:', error);
        setIsLoading(false);
      }
    };

    fetchFile();
  }, [url_location]);

  const placeholderImage = 'https://via.placeholder.com/600x400?text=Upload+Your+Image';

  if (isLoading) return <div>Loading...</div>;
  if (!fileUrl) return <div>Error loading file</div>;

  return (
      <div className="flex flex-col items-center gap-6 p-6">
          {/* 이미지 미리보기 */}
          <div className="w-3/4 max-w-4xl">
              <div className="border-2 border-dashed border-gray-400 rounded-lg overflow-hidden">
                  <img
                      src={fileUrl || placeholderImage}
                      alt="Preview"
                      className="w-full h-full object-cover"
                  />
              </div>
          </div>

          {/* 편집 도구 */}
          <div className="flex gap-4">
              <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                  Add Filter
              </button>
              <button className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
                  Add Frame
              </button>
              <button className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition">
                  Add Sticker
              </button>
              <button className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition">
                  Add Text
              </button>
          </div>

          {/* 작업 완료 및 저장 */}
          <div className="flex gap-4 mt-6">
              <button className="px-8 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition">
                  Save Changes
              </button>
              <button className="px-8 py-3 bg-red-700 text-white rounded-lg hover:bg-red-800 transition">
                  Cancel
              </button>
          </div>
      </div>
  );
};

export default Editor;
