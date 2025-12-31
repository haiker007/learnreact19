import { type ReactNode } from 'react';
import { Drawer, Button, Space } from 'antd';
import styles from './CommonDrawer.module.css';

interface CommonDrawerProps {
  // Control Props
  open: boolean;
  onClose: () => void;
  title: string;

  // Customization
  width?: number | string;
  isLoading?: boolean;

  // Form Connection
  formId?: string; // The ID of the form this drawer controls
  submitText?: string;

  // Content
  children: ReactNode;
}

export const CommonDrawer = ({
  open,
  onClose,
  title,
  width = 500, // Default slightly wider than AntD default
  isLoading = false,
  formId,
  submitText = 'Save',
  children,
}: CommonDrawerProps) => {
  return (
    <Drawer
      title={title}
      size={width as number}
      onClose={onClose}
      open={open}
      destroyOnHidden
      styles={{ body: { paddingBottom: 80 } }} // Ensure content clears footer
      className="common-drawer-wrapper"
    >
      {/* 1. The Content (Form goes here) */}
      <div className={styles.drawerBody}>{children}</div>

      {/* 2. The Standardized Footer */}
      <div className={styles.footer}>
        <Space>
          <Button onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>

          {/* This button triggers the form via the ID connection */}
          <Button type="primary" loading={isLoading} htmlType="submit" form={formId}>
            {submitText}
          </Button>
        </Space>
      </div>
    </Drawer>
  );
};
