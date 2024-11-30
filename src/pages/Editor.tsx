import React, { useEffect, useState } from 'react';
import { useLocation as useReactLocation } from 'react-router-dom';
import { getFile } from '../utils/api';
import ImageEditor from '../components/ImageEditor';

const Editor: React.FC = () => {
    const url_location = useReactLocation();
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchFile = async () => {
            try {
                const pathParts = url_location.pathname.split('/').slice(1); // URL 경로 분리
                const [year, month, location, fileName] = pathParts;

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

    if (isLoading) return <div>Loading...</div>;
    if (!fileUrl) return <div>Error loading file</div>;

    return (
        <div>
            <ImageEditor fileUrl={fileUrl} />
        </div>
    );
};

export default Editor;
