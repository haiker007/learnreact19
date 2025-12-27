import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { useEffect, useState } from 'react';

const DynamicIcon = ({ iconName }: { iconName: string }) => {
  const [IconComponent, setIconComponent] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    import('@ant-design/icons')
      .then((icons: any) => {
        const Icon = icons[iconName];
        if (Icon) {
          setIconComponent(() => Icon);
        } else {
          console.warn(`Icon ${iconName} not found in @ant-design/icons`);
        }
      })
      .catch((error) => {
        console.error(`Error loading icon ${iconName}:`, error);
      });
  }, [iconName]);

  if (!IconComponent) {
    return <Spin indicator={<LoadingOutlined style={{ fontSize: 14 }} spin />} />;
  }
  return <IconComponent />;
};

export default DynamicIcon;
