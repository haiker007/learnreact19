import { Card, DatePicker, Space, Typography, type DatePickerProps } from 'antd';
import { useState } from 'react';
import dayjs, { type Dayjs } from 'dayjs';
import { useTranslation } from 'react-i18next';

const { Text, Title } = Typography;

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());

  const { t } = useTranslation();

  const handleDateChange: DatePickerProps['onChange'] = (date) => {
    setSelectedDate(date);
  };
  return (
    <Space orientation="vertical" size="large" style={{ width: '100%' }}>
      <Title level={2}>{t('welcome_message')}</Title>
      <Card title="Date Selection" size="small">
        <Text strong>Filter Data By: </Text>
        <DatePicker onChange={handleDateChange} value={selectedDate} />
        <Text type="secondary">Currently viewing data for: {selectedDate ? selectedDate.format('MMMM D, YYYY') : 'N/A'}</Text>
      </Card>
    </Space>
  );
}
