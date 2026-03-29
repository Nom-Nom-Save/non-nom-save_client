import { createFileRoute } from '@tanstack/react-router';
import MenuPage from '@/pages/menu.page';

export const Route = createFileRoute('/_establishment/menu')({
  component: MenuPage,
});
