// mockData.ts
export interface ComponentMeta {
  key: string;
  name: string;
  category: string;
  icon: React.ReactNode;
  description: string;
}

export const AVAILABLE_COMPONENTS: ComponentMeta[] = [
  { key: 'hero_banner', name: '首屏大图', category: '营销', icon: '🖼️', description: '全宽背景图带标题和按钮' },
  { key: 'rich_text', name: '富文本段落', category: '基础', icon: '📝', description: '标准的文字编辑区域' },
  { key: 'image_gallery', name: '图片画廊', category: '媒体', icon: '📷', description: '多张图片网格展示' },
  { key: 'video_player', name: '视频播放器', category: '媒体', icon: '▶️', description: '嵌入 YouTube 或本地视频' },
  { key: 'newsletter_form', name: '订阅表单', category: '功能', icon: '📧', description: '收集用户邮箱' },
  { key: 'cta_button', name: '行动按钮', category: '营销', icon: '👆', description: '高转化的跳转按钮' },
];
