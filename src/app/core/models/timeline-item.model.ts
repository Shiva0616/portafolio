export interface TimelineItem {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  date: string;
  type: 'education' | 'complementary' | 'work';
  icon?: string;
  tags?: string[];
}
