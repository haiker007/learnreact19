import { Table, Button, Tag, Space, Popconfirm } from "antd";
import { UserForm } from "./UserForm"; // Add this import
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { CommonDrawer } from "@/components/CommonDrawer/CommonDrawer";
import type { ColumnsType } from "antd/es/table";
import type { User } from "@/features/users/usersApi";
import { useTranslation } from "react-i18next";
import styles from "./UsersView.module.css";

interface UsersViewProps {
  users: User[];
  isLoading: boolean;
  isSubmitting: boolean;
  isDrawerOpen: boolean;
  onCloseDrawer: () => void;
  onFormSubmit: (values: any) => void;
  onDelete: (id: string) => void;
  onCreate: () => void;
}

export const UsersView = ({
  users,
  isLoading,
  onDelete,
  onCreate,
  isDrawerOpen,
  onCloseDrawer,
  onFormSubmit,
  isSubmitting,
}: UsersViewProps) => {
  const { t } = useTranslation("users"); // Ensure you have users.json
  const FORM_ID = "create-user-form"; // Define a unique ID

  const columns: ColumnsType<User> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => (
        <span className="font-medium text-gray-900">{text}</span>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag
          color={role === "admin" ? "blue" : "default"}
          className="uppercase"
        >
          {role}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span className={`${styles.statusBadge} ${styles[status]}`}>
          {status}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            className={styles.actionBtn}
          />
          <Popconfirm
            title="Delete user?"
            onConfirm={() => onDelete(record.id)}
          >
            <Button
              type="text"
              icon={<DeleteOutlined />}
              className={`${styles.actionBtn} ${styles.delete}`}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>User Management</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
          {t("actions.add")}
        </Button>
      </div>

      <div className={styles.tableCard}>
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={isLoading}
          pagination={{ pageSize: 10 }}
        />
      </div>
      <CommonDrawer
        title="Create New User"
        width={450}
        open={isDrawerOpen}
        onClose={onCloseDrawer}
        isLoading={isSubmitting}
        formId={FORM_ID} // Pass ID to the wrapper
        submitText="Create User"
      >
        {/* Pass ID to the form */}
        <UserForm
          id={FORM_ID}
          onFinish={onFormSubmit}
          onCancel={onCloseDrawer}
          isLoading={isSubmitting}
        />
      </CommonDrawer>
    </div>
  );
};
